"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const data=[{name:"Low",value:8240},{name:"Monitor",value:3100},{name:"Elevated",value:1102},{name:"High",value:362},{name:"Critical",value:43}];
export function RiskChart(){return <div className="h-56"><ResponsiveContainer><BarChart data={data}><CartesianGrid stroke="#ffffff0d" vertical={false}/><XAxis dataKey="name" stroke="#7890a2" fontSize={9}/><YAxis stroke="#7890a2" fontSize={9}/><Tooltip contentStyle={{background:"#0b2134",border:"1px solid #ffffff1a",fontSize:11}}/><Bar dataKey="value" fill="#6ed8e0" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer></div>}
