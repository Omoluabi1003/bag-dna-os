import type { Airport } from "./airports";
export type GeoPoint = Pick<Airport, "latitude" | "longitude">;
export type CorridorBounds = { minLatitude:number; maxLatitude:number; minLongitude:number; maxLongitude:number; crossesAntimeridian:boolean };
const DEG=Math.PI/180;
export function sampleGreatCircle(start:GeoPoint,end:GeoPoint,steps=90):GeoPoint[]{
 if(steps<2) throw new Error("A route requires at least two samples");
 const aLat=start.latitude*DEG,aLon=start.longitude*DEG,bLat=end.latitude*DEG,bLon=end.longitude*DEG;
 const a=[Math.cos(aLat)*Math.cos(aLon),Math.cos(aLat)*Math.sin(aLon),Math.sin(aLat)],b=[Math.cos(bLat)*Math.cos(bLon),Math.cos(bLat)*Math.sin(bLon),Math.sin(bLat)];
 const omega=Math.acos(Math.min(1,Math.max(-1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2]))),divisor=Math.sin(omega)||1;
 return Array.from({length:steps},(_,index)=>{const t=index/(steps-1),s0=Math.sin((1-t)*omega)/divisor,s1=Math.sin(t*omega)/divisor,x=a[0]*s0+b[0]*s1,y=a[1]*s0+b[1]*s1,z=a[2]*s0+b[2]*s1;return{latitude:Math.atan2(z,Math.hypot(x,y))/DEG,longitude:Math.atan2(y,x)/DEG};});
}
export function computeCorridorBounds(route:readonly GeoPoint[]):CorridorBounds{
 if(route.length<2) throw new Error("Cannot fit an empty corridor route");
 const unwrapped=[route[0].longitude];
 for(let i=1;i<route.length;i+=1){let longitude=route[i].longitude;while(longitude-unwrapped[i-1]>180)longitude-=360;while(longitude-unwrapped[i-1]<-180)longitude+=360;unwrapped.push(longitude);}
 return{minLatitude:Math.max(-84,Math.min(...route.map(p=>p.latitude))),maxLatitude:Math.min(84,Math.max(...route.map(p=>p.latitude))),minLongitude:Math.min(...unwrapped),maxLongitude:Math.max(...unwrapped),crossesAntimeridian:unwrapped.some(l=>l < -180||l > 180)};
}
