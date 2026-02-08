import MenuBackgroundSync from './MenuBackgroundSync'

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MenuBackgroundSync />
      {children}
    </>
  )
}
