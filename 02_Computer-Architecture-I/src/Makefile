run: compile execute


compile:
	convert boba-fett.png boba-fett.rgb # JPG -> RGB
	gcc main.c -o exe
	
execute:
	./exe
	convert -size 320x180 -depth 8 final_result.rgb final_result.png # RGB -> PNG
	open final_result.png


clean:
	rm boba-fett.rgb
	rm final_result.png
	rm final_result.rgb
	rm exe
	rm testing.txt

testing:
	touch testing.txt
	./exe >> testing.txt
	open testing.txt

riscv:
	mv ~/Templates/RiscV/final_result.rgb .
	convert -size 320x180 -depth 8 final_result.rgb final_result.png # RGB -> PNG
	open final_result.png




