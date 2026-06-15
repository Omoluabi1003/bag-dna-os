"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const data=[12,9,14,8,7,11,6].map((value,i)=>({day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],value}));
export function IncidentTrend(){return <div className="h-44"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="day" stroke="#7890a2" fontSize={9}/><YAxis stroke="#7890a2" fontSize={9}/><Tooltip contentStyle={{background:"#0b2134",border:"1px solid #ffffff1a",fontSize:11}}/><Line dataKey="value" stroke="#f87171" strokeWidth={2}/></LineChart></ResponsiveContainer></div>}
