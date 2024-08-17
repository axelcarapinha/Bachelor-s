#include <stdio.h> 
#include <stdlib.h>

#define WIDTH 320
#define HEIGHT 180
#define SIZE (WIDTH * HEIGHT)


///////////////////////////////////////////////////////////////////////
// Function: hue
// Description: calcules the Hue value from R, G and B values of a pixel
// Arguments: address of the array rgb_values (char*) and the variable
// used as index of that array manipulated by this function (int)
//
// Returns: the value of Hue from the pixel with "i" index (wich RGB 
// values are on the rgb_values array
///////////////////////////////////////////////////////////////////////

int hue (unsigned char* rgb_values_p, int i) {
    
    int red   = rgb_values_p[i];
    int green = rgb_values_p[i + 1];
    int blue  = rgb_values_p[i + 2];

    // (Case 0) R > G >= B
    if (red > green && green >= blue)
        return 60 * (green - blue) / (red - blue);
    

    // (Case 1) G >= R > B
    else if (green >= red && red > blue) 
        return 120 - (60 * (red - blue) / (green - blue));
    
        
    // (Case 2) G > B >= R
    else if (green > blue && blue >= red) 
        return 120 + (60 * (blue - red) / (green - red));
    
          
    // (Case 3) B >= G > R
    else if (blue >= green && green > red) 
        return 240 - (60 * (green - red) / (blue - red));
    
         
    // (Case 4) B > R >= G
    else if (blue > red && red >= green) 
        return 240 + (60 * (red - green) / (blue - green));
    
        
    // (Case 5) R >= B > G
    else if (red >= blue && blue > green) 
        return 360 - (60 * (blue - green) / (red - green));
    
        
    // (Case 6) R = B = G 
    // in this case it returns zero
    // so that the pixel isn't considered 
    // as belonging to any of the characters
            
    return 0;
}
   






///////////////////////////////////////////////////////////////////////
// Function: indicator
// Description: given a character (e.g. 1,2,3) and a pixel with R, G 
// and B properties, it indicates if the pixel belongs (or not) to the
// choosed character
//
// Arguments: number corresponding to the character (int), address of
// the rgb_values array (char*) and the variable used as index of that
// array manipulated by the function hue
// 
// Returns: 1 (if the pixel belongs to the choosen character) or 0 
// (in the other case)
///////////////////////////////////////////////////////////////////////

int indicator (int number, unsigned char* rgb_values, int i) {
    int hue_value = hue (rgb_values, i);

    switch (number) {
        case 1: //Yoda
            return hue_value >= 40 && hue_value <= 80;
        case 2: //Darth Maul
            return hue_value >=  1 && hue_value <= 15;
        case 3: //"Mandalorian"
            return hue_value >= 160 && hue_value <= 180;
        default:
            printf("Invalid number.\n Please, try again\n");
            printf("Remember:\n\tEnter '1' for Yoda\n\tEnter '2' for Darth Maul\n\tEnter '3' for Boba-Fett\n");
            return 0;
    }
    return 0;
}









///////////////////////////////////////////////////////////////////////
// Function: location
// Description: calcules the "mass center" for a given character from 
// the coordinates passed by reference

// Arguments: address of the mass center's abscissa (int*) and ordinate
// (int*), address of the rgb_values array (char*) and the number 
// correspondent to the character (int)
// 
// Returns: nothing (it's a void type function)
///////////////////////////////////////////////////////////////////////

void location (int* center_x, int* center_y, unsigned char* rgb_values_p, int number) {
    int i;
    int N = 0;
    int calc_x = 0;
    int calc_y = 0;

    // In case these values have been changed
    *center_x = 0;
    *center_y = 0;
    

    for (i = 0; i < SIZE * 3; i += 3) {
        int indicator_value = indicator (number, rgb_values_p, i);

        // Calculation of N value (number of pixels)
        N += indicator_value;

        // Calculation of the  abcissa e da ordenada do "centro de massa"
        *center_x += indicator_value * calc_x;
        *center_y += indicator_value * calc_y;

        calc_x++;
        if (calc_x >= WIDTH) { // when the values of the first line are read
            calc_x = 0;              // the program is reading the first abscissa again,
            calc_y++;                // but this time of an upper line
        }
    }
	

    *center_x = *center_x / N;
    *center_y = *center_y / N;
}





///////////////////////////////////////////////////////////////////////
// Function: cross_maker
// Description: draws a cross (with pure yellow) from the "mass center"
// of the choosed character
//
// Arguments: address of the rgb_values array (char*), "mass center's" 
// abscissa (int) and ordinate (int)
// 
// Returns: nothing (it's a void type function)
///////////////////////////////////////////////////////////////////////

void cross_maker (unsigned char* rgb_values_p, int center_x, int center_y) {
	
    // The cross will be 39 pixels wide IN TOTAL (19 + 1 + 19)
   
    int j = 0;
    int cross_size = 19;
    for (j = -cross_size; j < cross_size + 1; j++) {
        // Make VERTICAL part of the cross
        rgb_values_p[((center_y + j) * WIDTH + center_x) * 3] = 255;
        rgb_values_p[((center_y + j) * WIDTH + center_x) * 3 + 1] = 255;
        rgb_values_p[((center_y + j)* WIDTH + center_x) * 3 + 2] = 0;

        // Make HORIZONTAL part of the cross
        rgb_values_p[(center_y * WIDTH + center_x + j) * 3] = 255;
        rgb_values_p[(center_y * WIDTH + center_x + j) * 3 + 1] = 255;
        rgb_values_p[(center_y * WIDTH + center_x + j) * 3 + 2] = 0;
    }
}












///////////////////////////////////////////////////////////////////////
// Function: read_rgb_image
// Description: reads a file with an image in RGB format to the array
// rgb_values in memory
//
// Arguments: filename (char*) and address of the rgb_values array 
// (char*)
// 
// Returns: nothing (it's a void type function)
///////////////////////////////////////////////////////////////////////

void read_rgb_image (const char* filename, unsigned char* rgb_values_p) {
    FILE* fptr;
    fptr = fopen (filename, "rb");

    if (fptr == NULL) {
        printf("File failed to open, sorry\n");
        return;
    }
    
    fread (rgb_values_p, 1, SIZE * 3, fptr);
    fclose(fptr);
}








///////////////////////////////////////////////////////////////////////
// Function: write_rgb_image
// Description: creates a new file with an image in RGB format with the
// RGB values changed by this program
// Arguments: filename (char*) and address of the rgb_values array 
// (char*)
// 
// Returns: nothing (it's a void type function)
///////////////////////////////////////////////////////////////////////

void write_rgb_image (const char* filename, unsigned char* rgb_values_p) {
    FILE* fptr;
    fptr = fopen ("final_result.rgb", "wb");

    if (fptr == NULL) {
        printf("File failed to open, sorry\n");
        return;
    }

    fwrite (rgb_values_p, 1, SIZE * 3, fptr);
    fclose(fptr);
}












int main (int argc, char* argv[]) 
{
    // Declaration of variables and array
    int number = 1;
    int center_x = 0;
    int center_y = 0;
    char* filename = "boba-fett.rgb";
    unsigned char* rgb_values = (char *) malloc(sizeof(unsigned char) * 320 * 180 * 3);

    // Interface
    printf("Please, enter the number of the character you want to identify\n");
    printf("1: Yoda\n");
    printf("2: Darth Maul\n");
    printf("3: 'Mandalorian'\n");
    scanf("%d", &number);
    

    // Calling of functions
    read_rgb_image(filename, rgb_values);
    location (&center_x, &center_y, rgb_values, number);




    ///////////////////////////////////////////////////////////////////////
    // TESTS
    //
    // (1.) Know the RGB values obtained at the end of the program execution
    /*int ola = 0;
    int x = 0, y = 0;

    for(int calc_y = 0; calc_y < HEIGHT * 3; calc_y += 3) {

        for (int calc_x = 0; calc_x < WIDTH * 3; calc_x += 3) {
            printf("Pixel(%d,%d): r:%d, g:%d, b:%d, hue:%d\n", x, y, rgb_values[ola], rgb_values[ola + 1], rgb_values[ola + 2], hue(rgb_values, ola));

            ola += 3;
            x++;
        }

        x = 0;
        y++;
    }
    */
    

   // (2.) Know the coordinates of the "mass center" of the choosed character
	//printf("'Mass center' of character %d = (%d,%d)\n", number, center_x, center_y);
   //////////////////////////////////////////////////////////////////////////////////


    cross_maker (rgb_values, center_x, center_y);
    write_rgb_image (filename, rgb_values);

   free (rgb_values);
   return 0;
}

