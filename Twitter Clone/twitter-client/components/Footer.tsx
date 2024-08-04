export default function Footer() {
  return (
    <div className="px-8 py-3 text-xs text-gray-400">
        <div className="flex justify-between">
          <a href="#">About</a>
          <a href="#">Download the X app</a>
          <a href="#">Help Centre</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Accessibility</a>
          <a href="#">Ads Info</a>
          <a href="#">Blog</a>
          <a href="#">Carrers</a>
          <a href="#">Brand Resources</a>
          <a href="#">Advertising</a>
          <a href="#">Marketing</a>
          <a href="#">X for Business</a>
          <a href="#">Develepors</a>
          <a href="#">Directory</a>
          <a href="#">Settings</a>
        </div>
        <div className="flex justify-center items-center pt-1">© {new Date().getFullYear()} X Corp.</div>
    </div>
  )
}
