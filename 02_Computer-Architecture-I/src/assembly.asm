.globl main


.data

# Instructions and error messsages
A: .string "Please, enter the number of the character you want to identify\n"
B: .string "1: Yoda\n2: Darth Maul\n3: 'Mandalorian'\n"
C: .string "Invalid number\nPlease,try again\n"
D: .string "Remember:\n\tEnter '1' for Yoda\n\tEnter '2' for Darth Maul\n\tEnter '3' for 'Mandalorian'\n"
E: .string "File failed to open, sorry\n"
F: .string "File failed to be read, sorry\n"
G: .string "File failed to be written, sorry\n"

# Global variables
FILENAME: 		.asciz "boba-fett.rgb"
NEW_FILENAME:		.asciz "final_result.rgb"	
FILE_DESCRIPTOR:	.word 0
NEW_FILE_DESCRIPTOR:	.word 0
ARRAY: 			.space 172800
NUMBER:			.word 0
center_x: 		.word 0
center_y: 		.word 0
IMAGE_WIDTH:		.word 320
IMAGE_HEIGHT:		.word 180
IMAGE_SIZE:		.word 57600
IMAGE_SIZE_BYTES:       .word 172800


.text

######################################################
# Function: hue
# Description: calculates the hue value from R, G and B 
# values of a pixel
#
# Arguments:
# a0 - address of ARRAY (the used buffer)
#
# Returns: 
# a0 - the hue value of the pixel (which RGB values
# are related to the address used here - the address 
# of the buffer manipulated by the function "location")
######################################################
hue:	
	addi sp, sp, -16
	sw ra, 0(sp)
	sw s0, 4(sp)	# red value
	sw s1, 8(sp)	# green value
	sw s2, 12(sp)	# blue value
	
	lbu s0, 0(a0)
	lbu s1, 1(a0) 	
	lbu s2, 2(a0) 	
			
		
	# (Case 0) R > G >= B
	ble s0, s1, hue_ELSE1
	blt s1, s2, hue_ELSE1
	
	sub t0, s1, s2		# green - blue
	sub t1, s0, s2		# red - blue
	li t3, 60			
	mul t0, t3, t0		# 60 * (green - blue)	
	div t0, t0, t1		# PREVIOUS / (red - blue)
	j hue_END
	
hue_ELSE1:   
	# (Case 1) G >= R > B
	blt s1, s0, hue_ELSE2
	ble s0, s2, hue_ELSE2
	
	sub t0, s0, s2		# red - blue
	sub t1, s1, s2		# green - blue
	li t2, 60			
	mul t0, t2, t0		# 60 * (red - blue)	
	div t0, t0, t1		# PREVIOUS / (green - blue)
	li t1, 120
	sub t0, t1, t0		# 120 - (60 * (red - blue) / (green - blue))
	j hue_END
	
hue_ELSE2:   
	# (Case 2) G > B >= R
	ble s1, s2, hue_ELSE3
	blt s2, s0, hue_ELSE3
	
	sub t0, s2, s0		# blue - red
	sub t1, s1, s0		# green - red
	li t2, 60			
	mul t0, t2, t0		# 60 * (blue - red)	
	div t0, t0, t1		# PREVIOUS / (green - red)
	addi t0, t0, 120	# 120 + (60 * (red - blue) / (green - blue))
	j hue_END
	
hue_ELSE3:   
	# (Case 3) B >= G > R
	blt s2, s1, hue_ELSE4
	ble s1, s0, hue_ELSE4
	
	sub t0, s1, s0		# green - red
	sub t1, s2, s0		# blue - red
	li t2, 60			
	mul t0, t2, t0		# 60 * (green - red)	
	div t0, t0, t1		# PREVIOUS / (blue - red)
	li t1, 240
	sub t0, t1, t0		# 240 - (60 * (green - red) / (blue - red))
	j hue_END
	
hue_ELSE4:   
	# (Case 4) B > R >= G
	ble s2, s0, hue_ELSE5
	blt s0, s1, hue_ELSE5
	
	sub t0, s0, s1		# red - green
	sub t1, s2, s1		# blue - green
	li t2, 60			
	mul t0, t2, t0		# 60 * (red - green)	
	div t0, t0, t1		# PREVIOUS / (blue - green)
	addi t0, t0, 240	# 240 + (60 * (red - green) / (blue - green))
	j hue_END
	
hue_ELSE5:   
	# (Case 5) R >= B > G
	blt s0, s2, hue_END
	ble s2, s1, hue_END
	
	sub t0, s2, s1		# blue - green
	sub t1, s0, s1		# red - green
	li t2, 60			
	mul t0, t2, t0		# 60 * (blue - green)	
	div t0, t0, t1		# PREVIOUS / (red - green)
	li t1, 360
	sub t0, t1, t0		# 360 - (60 * (blue - green) / (red - green))
	j hue_END
		
hue_END:	
	# (Case 6) R = G = B (or any of the specified)
	mv a0, t0
	
	lw ra, 0(sp)
	lw s0, 4(sp)
	lw s1, 8(sp)
	lw s2, 12(sp)
	addi sp, sp, 16
	
	ret
#-------------------------------------------------------------------------
	
######################################################
# Function: indicator
# Description: given a character (e.g. 1,2,3) and a 
# pixel with R, G and B values, it indicates if 
# the pixel belongs (or not) to the choosed character
#
# Arguments:
# a0 - number corresponding to the character
# a1 - address of ARRAY (the used buffer)
#
# Returns: 1 (if the pixel belongs to the choosen 
# character) or 0 (if it doesn't)
######################################################
indicator:
	addi sp, sp, -16
	sw ra, 0(sp)
	sw s0, 4(sp)	# hue_value
	sw s1, 20(sp)	# ARRAY
	sw s2, 24(sp)	# NUMBER

	mv s2, a0
	mv s1, a1	
	
	
	mv a0, s1
	jal hue	
	mv s0, a0
	
	li t0, 1	# Yoda's number
	li t1, 2	# Darth Maul's number
	li t2, 3	# 'Mandalorian''s number
	
	# Compare number inserted by user
	beq s2, t0, indicator_CASE1
	beq s2, t1, indicator_CASE2
	beq s2, t2, indicator_CASE3
			
	# If the number inserted is different from 1, 2 or 3
	la, a0, C
	li, a7, 4
	ecall
   
	la a0, D	
	li  a7, 4          
    	ecall
    	
    	j indicator_DEFAULT
    	
indicator_CASE1:	# Yoda
	li t0, 40
	li t1, 80
	blt s0, t0, indicator_DEFAULT
	bgt s0, t1, indicator_DEFAULT
	j indicator_END
	
indicator_CASE2:	# Darth Maul
	li t0, 1 
	li t1, 15
	blt s0, t0, indicator_DEFAULT
	bgt s0, t1, indicator_DEFAULT
	j indicator_END
	
indicator_CASE3: 	# 'Mandalorian'
	li t0, 160
	li t1, 180
	blt s0, t0, indicator_DEFAULT
	bgt s0, t1, indicator_DEFAULT
	j indicator_END


indicator_DEFAULT: 	
	li a0, 0	# Pixel does NOT belong to the character
			# This includes the case when R = G = B 
			# (it is considered that the pixel does not belong to any character)
	j indicator_RETURN
	
indicator_END: 	
	li a0, 1	# Pixel does belong to the character
	
indicator_RETURN:
	lw ra, 0(sp)
	lw s0, 4(sp)
	lw s1, 20(sp)
	lw s2, 24(sp)
	addi sp, sp, 16
	ret
#-------------------------------------------------------------------------

######################################################
# Function: location
# Description: calcules the "mass center" for a given 
# character from the coordinates passed by reference
#
# Arguments:
# a0 - address of the "mass center's" abscissa
# a1 - address of the "mass center's" ordinate
# a2 - address of ARRAY (the used buffer)
# a3 - number correspondent to the character
#
# Returns: nothing
######################################################																																						
location:
	addi sp, sp, -48
	sw ra, 0(sp)
	sw s0, 4(sp) 			# IMAGE_SIZE_BYTES	
	sw s1, 8(sp)			# N
	sw s2, 12(sp)			# calc_x
	sw s3, 16(sp)			# calc_y
	sw s4, 20(sp)			# indicator_value
	sw s5, 24(sp)			# IMAGE_WIDTH
	sw s6, 28(sp) 			# address of the "mass center's" abscissa (center_x)
	sw s7, 32(sp)			# address of the "mass center's" ordinate (center_y)
	sw s8, 36(sp)			# address of ARRAY (the used buffer)
	sw s9, 40(sp)			# number
	sw s10, 44(sp)			# j (the loop counter)
	
	mv s6, a0
	mv s7, a1			
	mv s8, a2
	mv s9, a3
	
	lw s0, IMAGE_SIZE_BYTES	
	li s1, 0
	li s2, 0
	li s3, 0
	li s4, 0	
	lw s5, IMAGE_WIDTH
	
	li t0, 0
	sw t0, (s6)
	sw t0, (s7)	
	li s10, 0
	

location_LOOP:	
	beq s10, s0, location_END
	
	mv a0, s9
	mv a1, s8
	jal indicator
	mv s4, a0
	
	add s1, s1, s4			#  N += indicator_value
	
	mul t0, s4, s2			# indicator_value * calc_x	
	lw t1, (s6)			# *center_x
	add t1, t1, t0
	sw t1, (s6)			# *center_x += PREVIOUS VALUE
	
	mul t0, s4, s3			# indicator_value * calc_y	
	lw t1, (s7)			# *center_y
	add t1, t1, t0
	sw t1, (s7)			# *center_y += PREVIOUS VALUE
	
	addi s8, s8, 3 			# increment array pointer to the next pixel
	
	addi s2, s2, 1			# calc_x++
	blt s2, s5, location_ELSE
	li s2, 0
	addi s3, s3, 1			# calc_y++
	
location_ELSE:
	addi s10, s10, 1		# j++
	j location_LOOP
	

location_END:
	lw t0, (s6)
	div t1, t0, s1			
	sw t1, (s6)			#  *center_x = *center_x / N
	
	lw t0, (s7)
	div t1, t0, s1
	sw t1, (s7)			#  *center_y = *center_y / N
	
	
	lw ra, 0(sp)		
	lw s0, 4(sp) 
	lw s1, 8(sp)
	lw s2, 12(sp)
	lw s3, 16(sp)
	lw s4, 20(sp)
	lw s5, 24(sp)
	lw s6, 28(sp) 
	lw s7, 32(sp)
	lw s8, 36(sp)
	lw s9, 40(sp) 
	lw s10, 44(sp)
	addi sp, sp, 48
	
	ret
#-------------------------------------------------------------------------

######################################################
# Function: cross_maker
# Description: draws a cross (with pure yellow) from 
# the "mass center" of the choosed character
#
# Arguments:
# a0 - address of ARRAY (the used buffer)
# a1 - address of the "mass center's" abscissa
# a2 - address of the "mass center's" ordinate
#
# Returns: nothing
######################################################
cross_maker:
	
	addi sp, sp, -32
	sw s0, 0(sp)		# IMAGE_WIDTH
	sw s1, 4(sp)		# cross_size + 1
	sw s2, 8(sp)		# j (the loop counter)
	sw s3, 12(sp)		# Red and Green value of cross' pixels
	sw s4, 16(sp)		# Blue value          of cross' pixels
	sw s5, 20(sp)		# address of ARRAY (the used buffer)
	sw s6, 24(sp)		# center_x
	sw s7, 28(sp)		# center_y
	
	lw s0, IMAGE_WIDTH
	li s1, 19
	li s2, -19		
	li s3, 255		# R = 255 and G = 255
	li s4, 0		# B = 0
	mv s5, a0
	lw s6, 0(a1)		# *center_x
	lw s7, 0(a2)		# *center_y
	
	
	addi s1, s1, 1		# cross_size += 1
	
cross_maker_LOOP:
	bge s2, s1, cross_maker_END	# The cross will be 39 pixels wide IN TOTAL (19 + 1 + 19)
	
	# Make VERTICAL part of the cross
	add t0, s7, s2	# center_y + j
	mul t0, t0, s0	# PREVIOUS * IMAGE_WIDTH
	add t0, t0, s6	# PREVIOUS + center_x
	li t1, 3	
	mul t0, t0, t1	# ((center_y + j) * IMAGE_WIDTH + center_x) * 3
	
	add t0, t0, s5    
	sb s3, 0(t0)
	sb s3, 1(t0)
	sb s4, 2(t0)
	
	# Make HORIZONTAL part of the cross
	mul t0, s7, s0	# center_y * IMAGE_WIDTH
	add t0, t0, s6	# PREVIOUS + center_x
	add t0, t0, s2	# PREVIOUS + j
	li t1, 3	
	mul t0, t0, t1 	# (center_y * IMAGE_WIDTH + center_x + j) * 3
	
	add t0, t0, s5
	sb s3, 0(t0)
	sb s3, 1(t0)
	sb s4, 2(t0)

	addi s2, s2, 1	# j++
	j cross_maker_LOOP
	
	
cross_maker_END:

	lw s0, 0(sp)
	lw s1, 4(sp)
	lw s2, 8(sp)
	lw s3, 12(sp)
	lw s4, 16(sp)
	lw s5, 20(sp)
	lw s6, 24(sp)
	lw s7, 28(sp)
	addi sp, sp, 32
		
	ret
#-------------------------------------------------------------------------

######################################################
# Function: write_rgb_image
# Description: creates a new file with an image in RGB
# format with the RGB values changed by this program
#
# Arguments:
# a0 - address of ARRAY (the used buffer)
#
# Returns: nothing
######################################################	
write_rgb_image:
	
	addi sp, sp, -4
	sw s0, 0(sp)	# address of ARRAY (the used buffer)
	
	mv s0, a0
	
	
	# (1.) Open rgb file 
	li a7, 1024
	la a0, NEW_FILENAME
	li a1, 1	# write-only	
	ecall

	la t0, NEW_FILE_DESCRIPTOR	
	sw a0, 0(t0)
	
	# Check of opening errors
	bltz a0, read_rgb_image_ERROR_OPENING	
	la t0, FILE_DESCRIPTOR
	sw a0, 0(t0) 	# Save FILE* in FILE_DESCRIPTOR
					
	# (2.) Write file			
	lw a0, NEW_FILE_DESCRIPTOR
	mv a1, s0		
	lw a2, IMAGE_SIZE_BYTES
	li a7, 64
	ecall
	
	# Check for writing errors
	bne a0, a2, write_rgb_image_ERROR_WRITING 
	
	# (3.) Close File
	lw a0, NEW_FILE_DESCRIPTOR
	li a7, 57
	ecall
	j write_rgb_image_END
	
write_rgb_image_ERROR_OPENING:	
	la a0, E	
	li  a7, 4    
	ecall
	j write_rgb_image_END  
	
write_rgb_image_ERROR_WRITING:	
	la a0, G	
	li  a7, 4    
	ecall
	j write_rgb_image_END  
	
write_rgb_image_END:
	lw s0, 0(sp)
	addi sp, sp, 4
	
	ret
#-------------------------------------------------------------------------

######################################################
# Function: read_rgb_image
# Description: reads a file with an image in RGB format
# to the array rgb_values in memory
#
# Arguments:
# a0 - address of ARRAY (the used buffer)
#
# Returns: nothing
######################################################	
read_rgb_image:
	addi sp, sp, -4
	sw s0, 0(sp)
	
	mv s0, a0 	# ARRAY
	
	# (1.) Open rgb file 
	li a7, 1024
	la a0, FILENAME
	li a1, 0	# read-only
	ecall

	# Check of opening errors
	bltz a0, read_rgb_image_ERROR_OPENING	
	la t0, FILE_DESCRIPTOR
	sw a0, 0(t0) 	# Save FILE* in FILE_DESCRIPTOR
	
	# (2.) Read rgb file 
	li a7, 63	# a0 already contains the file decriptor key
	mv a1, s0
	la a2, IMAGE_SIZE_BYTES
	ecall
	
	# Check for reading errors
	bltz a0, read_rgb_image_ERROR_READING
	ret
	
	# (3.) Close file
	lw a0, FILE_DESCRIPTOR
	li a7, 57
	ecall
	

read_rgb_image_ERROR_OPENING:	
	la a0, E	
	li  a7, 4    
	ecall
	j read_rgb_image_END  
	
read_rgb_image_ERROR_READING:	
	la a0, F	
	li  a7, 4      
	ecall
	
read_rgb_image_END:
	lw s0, 0(sp)
	addi sp, sp, 4
	ret
#-------------------------------------------------------------------------

main:
	# Print strings A and B (nullt terminated strings)
	la a0, A	
	li  a7, 4      
	ecall
    	
	la a0, B	
	li  a7, 4          
  	ecall
	
	# Read integer from input (variable "number")	
	li  a7, 5          
    	ecall
    	la t0, NUMBER
    	sw a0, 0(t0) 	# Save result in NUMBER global "variable"
    	
    	# Calling of functions
    	la a0, ARRAY
    	jal read_rgb_image
    	
    	la a0, center_x
	la a1, center_y
	la a2, ARRAY
	lw a3, NUMBER
    	jal location
    	
    	la a0, ARRAY
    	la a1, center_x
    	la a2, center_y
    	jal cross_maker
    	   	
    	la a0, ARRAY
    	jal write_rgb_image
    	
	# Exit the program with code 0
    	li a7, 10
    	ecall