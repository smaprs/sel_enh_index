/*
"Selective Enhancement based on Indices" for Sentinel-2 
By Sérgio A. J. Volkmer (https://twitter.com/sergioajv1) * CC BY 4.0 International - https://creativecommons.org/licenses/by/4.0/
References: 
Selective treatment based on S.GASCOIN's "Better snow visualisation using NDSI" https://www.sentinel-hub.com/contest
Enhancement functions based on P.MARKUSE's "Wildfire visualization" https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Script abbreviated for lenght limit; try to change values a bit to fit better for different images.
*/
// ENHANCEMENT FUNCTIONS :
function a(a, b) {return a + b};
// CONTRAST:
function stretch(val, min, max) {return (val - min) / (max - min);} 
// SATURATION (for Verse & Inverse selection):
function satEnh_V(rgbArr) {
    var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length;
    return rgbArr.map(a => avg * (1 - SATU_V) + a * SATU_V); }	
function satEnh_I(rgbArr) {
    var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length;
    return rgbArr.map(a => avg * (1 - SATU_I) + a * SATU_I); } 
// CONTRAST + SATURATION:
function applyEnh_V(bArr) {
	return satEnh_V([stretch(bArr[0], SminV, SmaxV), stretch(bArr[1], SminV, SmaxV), stretch(bArr[2], SminV, SmaxV)]); }
function applyEnh_I(bArr) {
	return satEnh_I([stretch(bArr[0], SminI, SmaxI), stretch(bArr[1], SminI, SmaxI), stretch(bArr[2], SminI, SmaxI)]); }
//=======================
// *SETTINGS*
// STRETCH CONTRAST (std=0,1; darken+; lighten-; blackout=1,1):
var SminV = 0.1 ; // Shadows
var SmaxV = 1.1 ; // Lights
var SminI = 0.1 ; // idem
var SmaxI = 1.1 ; // idem
// SATURATION (std=1.0; monochr=0):
var SATU_V = 1.1 ;
var SATU_I = 1.1 ;

// INDEX (Choose one):
//----Vegetation:
//var NBR = (B08-B12)/(B08+B12); // BURN Ratio: H.Burn>0.6  Unburned-0.1to+0.1  H.Regrowth<-0.25 /(B08orB09)
//var ARVI = (B08-B04-0.106*(B04-B02))/(B08+B04-0.106*(B04-B02)); // ATMOSPHERICALLY Resistant V.I. VEG:0.2-0.8 /(or B09;B05) 
//var NDVI = (B08-B04)/(B08+B04); // VEGET x NON-V.: DenseV>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 
//var SAVI = (B08-B04)/(B08+B04+0.428)*(1.0+0.428); // SOIL bright. minimized (NDVI) std>0.2
//----Water:
//var NDSI = (B03-B11)/(B03+B11); // Snow&Water x NON-W: std>0.42;
//var NDWI = (B08-B11)/(B08+B11); // Water on leaves; std>0.3 (=NDMI)
var NDWI2 = (B03-B08)/(B03+B08); // Water bodies; std>0.3 (=NDMI)

// BAND COMPOSTIONS (Proposed): 
//---VERSE (~water):
var NATURAL_REDGE = [(B04*4.0), (B03*2.8+B06*1.5), (B02*3.5)]; // Near Nat; turbidity and algae 
//var ENH_REDGE = [(B04*6.7-B08*2.5), (B03*2+B07*5), (B02*3.8)]; // Turbidity, algae 
//var FALSECOLOR_NIR = [(B08*2.3), (B03*1.0+B05*2.0), (B02*2.7)]; // Bluish water NIR; algae 
//---INVERSE (~non-water):
//var NATURAL = [B04*4, B03*4, B02*4] ; 
//var NAT_ATM = [B04*4-B10*5, B03*4-B10*5, B02*4-B10*5] ; // Minimizes cloud : B10 variable
var NATURAL_NIR = [(B04*3.0+B05*1.0), (B03*3.0+B08*1.0), (B02*3.5)] ; // Near Nat.; Veg.NIR 
//var NATURAL_SWIR = [(B04*2.6+B12*0.8), (B03*3.0+B08*0.5), (B02*3.0)] ; // Bare soil SWIR; Veg.NIR
//var GEOLOGY_SWIR = [(B12*2.2), (B04*1.4+B08*1.0), (B02*2.5)] ; // Geology SWIR; Veg.NIR

// SET COMPOSTIONS (can invert or repeat): 
var MaskVERSE   = NATURAL_REDGE ;
var MaskINVERSE = NATURAL_NIR ; 
//=======================
var EnhVERSE = applyEnh_V(MaskVERSE); var EnhINVERSE = applyEnh_I(MaskINVERSE); // No settings
//=======================
// Choose ONLY ONE INDEX & limit:
//return ( ARVI > 0.4 ) ? EnhVERSE : EnhINVERSE ;
//return ( NDSI > 0.42 ) ? EnhVERSE : EnhINVERSE ;
//return ( NDVI > 0.4 ) ? EnhVERSE : EnhINVERSE ;
return ( NDWI2 > 0.1 ) ? EnhVERSE : EnhINVERSE ;
//
