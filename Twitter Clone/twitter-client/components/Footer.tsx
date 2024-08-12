export default function Footer() {
  return (
    <div className="px-8 py-3 text-xs text-gray-400">
        <div className="lg:flex lg:justify-center">
          <div className="grid grid-rows-3 lg:flex">
            <div className="row-span-1 flex justify-center">
              <a href="#" className="px-1">About</a>
              <a href="#" className="px-1">Download the X app</a>
              <a href="#" className="px-1">Help Centre</a>
              <a href="#" className="px-1">Terms of Service</a>
              <a href="#" className="px-1">Privacy Policy</a>
              <a href="#" className="px-1">Cookie Policy</a>
            </div>
            <div className="row-span-1 flex justify-center">
              <a href="#" className="px-1">Accessibility</a>
              <a href="#" className="px-1">Ads Info</a>
              <a href="#" className="px-1">Blog</a>
              <a href="#" className="px-1">Carrers</a>
              <a href="#" className="px-1">Brand Resources</a>
              <a href="#" className="px-1">Advertising</a>
              <a href="#" className="px-1">Marketing</a>
            </div>
            <div className="row-span-1 flex justify-center">
              <a href="#" className="px-3">X for Business</a>
              <a href="#" className="px-1">Develepors</a>
              <a href="#" className="px-1">Directory</a>
              <a href="#" className="px-1">Settings</a>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center pt-1">© {new Date().getFullYear()} X Corp.</div>
    </div>
  )
}
