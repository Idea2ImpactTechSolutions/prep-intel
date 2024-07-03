export default function Denied() {
  return (
    <section className="flex flex-col gap-12 items-center">
      <h1 className="text-xl">Access Denied</h1>
      <p className="text-lg">You are logged in but do not have access to this area. Please contact your administrator for details.</p>
    </section>
  )
}