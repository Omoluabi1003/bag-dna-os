export function CommandCard({ children, className="" }:{children:React.ReactNode;className?:string}) {
  return <section className={`glass p-5 ${className}`}>{children}</section>;
}
