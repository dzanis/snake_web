#include <stdio.h>
#include <stdlib.h> // for rand
#include <math.h>
#include <time.h>
#include <emscripten.h>
// for bool
#include <stdbool.h>
#define TRUE 1
#define FALSE 0
// for OpenGL
#define GL_LINE_STRIP 0
#define GL_LINES 1
#define GL_POINTS 2
#define GL_COLOR_BUFFER_BIT 1 
#define GL_DEPTH_BUFFER_BIT 2
// for KEY
#define KEY_LEFT 37
#define KEY_RIGHT 39
#define KEY_UP 38
#define KEY_DOWN 40
#define KEY_SPACE 32
#define KEY_M 77

#define NDEBUG

int _type;
int begin;
int _pointSize = 1;

typedef  struct {int x,y,w,h;}viewPort;
viewPort v;

void glViewport(int x,int y,int w,int h)
{
	v.x =x;
	v.y =y;
	v.w =w;
	v.h =h;	
	//printf("viewport %d  %d  %d  %d \n", v.x, v.y, v.w, v.h);
	
}

typedef struct {float r,g,b,a;}clearColor;
clearColor cc;

void glClearColor(float r, float g, float b,float a)
{
	cc.r = r;
	cc.g = g;
	cc.b = b;
	cc.a = a;		
	//printf("clear color %f  %f  %f  %f \n", cc.r,cc.g,cc.b,cc.a);
}

void glClear(int BUFFER_BIT)
{
	EM_ASM({strokeStyle($0,$1,$2)},cc.r,cc.g,cc.b);
	EM_ASM({ctx.fillRect($0,$1,$2,$3)},v.x, v.y, v.w, v.h);		
}

void glTranslatef(int x , int y , int z)
{
	EM_ASM({ctx.translate($0,$1)},x,y);
}


void glRotatef(float angle, int x , int y , int z)
{
	EM_ASM({ctx.rotate($0)},angle * M_PI  / 180);
}

void glPushMatrix()
{
	EM_ASM(ctx.save());
}

void glPopMatrix()
{
	EM_ASM(ctx.restore());
}

void glBegin(int type)
{
	EM_ASM(ctx.beginPath());
	_type = type;
	begin = 1;	
}

void glVertex2i(int x,int y)
{	
	switch(_type)
	{
		case GL_LINE_STRIP:
		if(begin == 1)
		{
			EM_ASM({ctx.moveTo($0,$1)},x,y);
			begin = 0;
		}
		EM_ASM({ctx.lineTo($0,$1)},x,y);		
		break;
		case GL_POINTS:
		// 0.5 это чтобы убрать размытость
		EM_ASM({ctx.fillRect($0,$1,$2,$3)},x-1.5,y-1.5,_pointSize,_pointSize);		
		break;case GL_LINES:
		if(begin == 1)
		{
			EM_ASM({ctx.moveTo($0,$1)},x,y);
			begin = 0;
		}
		else
		{
			EM_ASM({ctx.lineTo($0,$1)},x,y);
			begin = 1;
		}				
		break;
	}
	
}

void glEnd()
{
	EM_ASM(ctx.stroke());
	begin = 0;
}

void glLineWidth(int width)
{
	EM_ASM({ctx.lineWidth = $0;}, width);	
}

void glPointSize(int size)
{
	_pointSize = size;
	//EM_ASM({ctx.lineWidth = $0;}, size);
}

void glRecti( int x,int y,int w ,int h)
{	
	// 0.5 это чтобы убрать размытость
	EM_ASM({ctx.fillRect($0,$1,$2,$3)},x+0.5,y+0.5,w-x,h-y);
}



void glColor3ub(int r, int g, int b)
{
	// установка цвета строкой очень медленна
	//char str[25];
	//sprintf (str, "rgba(%d,%d,%d,1.0)", r, g, b);
	//EM_ASM({ctx.strokeStyle = AsciiToString($0);}, str);
		
	EM_ASM(strokeStyle($0,$1,$2),r,g,b);
}


typedef struct 
{
	int size;
	const char * fontName;
} Font;

void fontInit(Font * font,int size, const char * fontName)
{	
	font->size = size;
    font->fontName = fontName;
}

Font prevFont;

void setFont(Font font)
{
	if(&prevFont != &font)
	{
	char str[40];
	sprintf (str, "%dpx %s", font.size ,font.fontName);
	//printf ("%s \n", str);
	EM_ASM({ctx.font = AsciiToString($0)}, str);
	prevFont = font;
	}
}

void drawText(Font font,float x,float y,const char * text)
{
	setFont(font);
	EM_ASM({
		ctx.textAlign = "start";
		ctx.fillText(AsciiToString($0),$1,$2)
		}, text,x,y);
}

void drawTextCenter(Font font,float x,float y,const char * text)
{
	setFont(font);
	EM_ASM({
		ctx.textAlign = "center";
		ctx.fillText(AsciiToString($0),$1,$2);		
		}, text,x,y);
}

void drawNum(Font font,float x,float y,int num)
{
    char str[10];
    sprintf(str, "%d", num);
    drawText(font,x,y,str);
}

int getFPS() 
{
	static int fps,fps_count;
	static int fps_time ;
	fps_count++;
	if(clock() - fps_time > CLOCKS_PER_SEC )
	{
		fps_time = clock();
		fps = fps_count;
		fps_count = 0;
	}
	return  fps;
}



