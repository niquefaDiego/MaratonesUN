// PARAMETERS

var H_GAP = 80; // space between the nodes in the last level
var V_GAP = 64; // vertical spacing between levels

var LINE_WIDTH = 4/3; // width of all lines, including circle borders
var STROKE_STYLE = 'black'; // color of all lines, including circle borders

var CIRCLE_RADIUS = 18; // radius of the circles and half the side length of the squares
var CIRCLE_COLOR = 'white'; // color of circles fill
var SQUARE_COLOR = "white"; // color to fill the squares

var BACKGROUND_COLOR = "white";

var TEXT_FONT = '20px san-serif';
var ARRAY_TEXT_COLOR = '#ff0000';
var ARRAY_INDEX_TEXT_COLOR = "blue";
var NODE_TEXT_COLOR = '#ff0000';
var NODE_INDEX_TEXT_COLOR = 'blue';

var INF = Number.MAX_SAFE_INTEGER;
var array = [1, 10, 3, -2, 8, 4, 3, 4]

// END OF PARAMETERS

function println(x) { console.log(x); }

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function writeCenteredText ( text, x, y, width, height, color ) {
	ctx.fillStyle = color;
	ctx.font = TEXT_FONT;
	var textWidth = ctx.measureText(text).width;
	ctx.fillText(text, x+(width-textWidth)/2, y+height*0.73);
}	

var ROOT = 1; // root node of the segment tree
function parent(i) { return i>>1; }
function leftChild(i) { return (i<<1); }
function rightChild(i) { return (i<<1)+1; }

var n = array.length;
var nLevels = 33 - Math.clz32(n-1);

var segmentTree = [];

//coordinates to draw the center of the circle of each segment tree node
var positionX = {};
var positionY = {};

//coordinates to draw the center of the square of each array element
var arrayElementPositionX = [];
var arrayElementPositionY = (nLevels) * H_GAP;

//resize canvas
canvas.width  = H_GAP * (1<<(nLevels-1));
canvas.height = arrayElementPositionY + 3*CIRCLE_RADIUS;

//debugs
println( "Array has " + n + " elements" );
println( "Segment tree has " + nLevels + " levels" );
println( "Dimensions of canvas: width=\"" + canvas.width + "\" height=\"" + canvas.height + "\"");

//white background
ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

function merge ( a, b ) {
	return a+b;
}

function findPositions ( i=ROOT, depth=1 )
{
	positionY[i] = (depth-0.5) * V_GAP;

	if ( depth == nLevels )
		positionX[i] = ( i - (1<<depth-1) + 0.5 ) * H_GAP;
	else
		positionX[i] = ( findPositions(leftChild(i), depth+1 )
				+ findPositions(rightChild(i), depth+1 ) ) / 2;
	return positionX[i];
}

findPositions();

function draw ( phase, i=ROOT, fr=0, to=n-1 ) {

	if ( phase == 1 )
	{
		if ( i != ROOT ) {
			ctx.beginPath();
			ctx.lineWidth = LINE_WIDTH;
			ctx.strokeStyle = STROKE_STYLE;
			ctx.moveTo(positionX[parent(i)],positionY[parent(i)]);
			ctx.lineTo(positionX[i], positionY[i]);
			ctx.stroke();
		}
		if ( fr == to ) {
			arrayElementPositionX.push( positionX[i] );
			segmentTree[i] = array[fr];
		}
	}
	else 
	{

		ctx.beginPath();
		ctx.arc(positionX[i], positionY[i], CIRCLE_RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = CIRCLE_COLOR;
		ctx.fill();
		ctx.lineWidth = LINE_WIDTH;
		ctx.strokeStyle = STROKE_STYLE;
		ctx.stroke();

		var size = CIRCLE_RADIUS*2;
		var x = positionX[i] - size/2;
		var y = positionY[i] - size/2;

		writeCenteredText(""+segmentTree[i], x, y, size, size, NODE_TEXT_COLOR);
		writeCenteredText("[" + fr + "," + to +"]", x, y+size*0.98, size, size, NODE_INDEX_TEXT_COLOR);
	}

	if ( fr == to ) return
	var mid = (fr+to) >> 1
	draw ( phase, leftChild(i), fr, mid )
	draw ( phase, rightChild(i), mid+1, to )

	if ( phase == 1 )
		segmentTree[i] = merge ( segmentTree[leftChild(i)], segmentTree[rightChild(i)] );
}

draw(1);
draw(2);

for ( var i = 0; i < n; ++i ) {
	ctx.beginPath();

	var size = 2*CIRCLE_RADIUS;
	var x = arrayElementPositionX[i]-size/2;
	var y = arrayElementPositionY-size/2;

	ctx.fillStyle = SQUARE_COLOR;
	ctx.fillRect(x,y,size,size);

	ctx.beginPath();
	ctx.lineWidth=LINE_WIDTH;
	ctx.strokeStyle=STROKE_STYLE;
	ctx.rect(x, y, size, size);
	ctx.stroke();

	var element = ( array[i] == INF ? "∞" : ""+array[i])
	writeCenteredText(element, x, y, size, size, ARRAY_TEXT_COLOR);
	writeCenteredText(""+i, x, y+size, size, size, ARRAY_INDEX_TEXT_COLOR);
}
