import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  BellIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChartBarSquareIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import ThemeSwitcher from './ThemeSwitcher.jsx'

const products = [
  { name: 'STATISTIK PENGUATKUASAAN', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon, action: 'penguatkuasaan' },
  { name: 'STATISTIK SIASATAN', description: '', href: '#', icon: ChartBarIcon },
  { name: 'STATISTIK HUKUMAN (KOMPAUN & DENDA)', description: '', href: '#', icon: ChartBarSquareIcon },
  { name: 'STATISTIK PELUPUSAN', description: '', href: '#', icon: PresentationChartLineIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Navigation({ currentPage, setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="p-2">
      {/* <Disclosure as="nav" className=""> */}
      <nav aria-label="Global" className="flex items-center justify-between">
        <div className="flex lg:flex-1 items-center gap-4">
          <a href="#" className="flex items-center gap-3">
            <span className="sr-only">KDN</span>
            <div className="flex items-center gap-2">
              <img
                alt="Logo 1"
                src={`/img/logo2.png`}
                className="h-16 w-auto"
              />
              <img
                alt="Logo 2"
                src={`/img/logo1.png`}
                className="h-16 w-auto"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-sky-500">KDN - PENGUATKUASAAN & KAWALAN</h2>
              <h3 className="text-sm text-gray-700">KEMENTERIAN DALAM NEGERI MALAYSIA</h3>
            </div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 items-center">
          <Popover className="relative">
            <PopoverButton className={`flex items-center gap-x-1 text-sm/6 font-semibold ${currentPage === 'penguatkuasaan' ? 'text-indigo-600' : 'text-gray-900'}`}>
              PENGUATKUASAAN
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-yellow-600 shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-auto">
                      <a 
                        href={item.href} 
                        onClick={(e) => {
                          if (item.action) {
                            e.preventDefault();
                            setCurrentPage(item.action);
                          }
                        }}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </a>
                ))}
              </div> */}
            </PopoverPanel>
          </Popover>

          <a href="#"
            onClick={() => setCurrentPage('kajian')}
            className={`text-sm/6 font-semibold ${currentPage === 'kajian' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'kajian' ? 'page' : undefined}
          >
            KAJIAN & PERINTAH LARANGAN
          </a>
          <a href="#"
            onClick={() => setCurrentPage('pruf')}
            className={`text-sm/6 font-semibold ${currentPage === 'pruf' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'pruf' ? 'page' : undefined}
          >
            PRUF (AL-QURAN)
          </a>
          <a href="#"
            onClick={() => setCurrentPage('overview')}
            className={`text-sm/6 font-semibold ${currentPage === 'overview' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'overview' ? 'page' : undefined}
          >
            LESEN & PERMIT
          </a>
          <a href="#"
            onClick={() => setCurrentPage('dasar')}
            className={`text-sm/6 font-semibold ${currentPage === 'dasar' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'dasar' ? 'page' : undefined}
          >
            DASAR
          </a>
          <a href="#"
            onClick={() => setCurrentPage('seranta')}
            className={`text-sm/6 font-semibold ${currentPage === 'seranta' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'seranta' ? 'page' : undefined}
          >
            SERANTA & KORPORAT
          </a>
          {/* <button
            onClick={() => setCurrentPage('analytics')}
            className={`text-sm/6 font-semibold ${currentPage === 'analytics' ? 'text-indigo-600' : 'text-gray-900'}`}
            aria-current={currentPage === 'analytics' ? 'page' : undefined}
          >
            ANALYTICS
          </button> */}
          {/* <a href="#" onClick={() => setCurrentPage('pnp')}
              className={`text-sm/6 font-semibold  ${currentPage === 'pnp' ? 'text-indigo-600' : 'text-gray-900'}`}
              aria-current={currentPage === 'pnp' ? 'page' : undefined}>
              PENDIDIKAN & PENCEGAHAN
          </a>  */}
        </PopoverGroup>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src={`/img/man.png`}
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-950 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    ARIF RAMLI 
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-950 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-950 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Keluar
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
        </div>
        
            {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <ThemeSwitcher />
            </div> */}
              {/* <div className="pl-2">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div> */}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-200 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <span className="sr-only">KDN</span>
              <div className="flex items-center gap-2">
                <img
                  alt="Logo 1"
                  src={`/img/logo1.png`}
                  className="h-12 w-auto"
                />
                <img
                  alt="Logo 2"
                  src={`/img/logo2.png`}
                  className="h-12 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-indigo-600">KDN - DASHBOARD</h2>
                <h3 className="text-xs text-gray-700">KEMENTERIAN DALAM NEGERI</h3>
              </div>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure> */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('overview');
                  }}
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${currentPage === 'overview' ? 'bg-gray-100' : ''} text-gray-900 hover:bg-gray-50`}
                >
                  LESEN, PERMIT & PRUF
                </button>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('kajian');
                  }}
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${currentPage === 'kajian' ? 'bg-gray-100' : ''} text-gray-900 hover:bg-gray-50`}
                >
                  KAJIAN & PERINTAH LARANGAN
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('penguatkuasaan');
                  }}
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${currentPage === 'penguatkuasaan' ? 'bg-gray-100' : ''} text-gray-900 hover:bg-gray-50`}
                >
                  PENGUATKUASAAN
                </button>
                              
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('pnp');
                  }}
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${currentPage === 'pnp' ? 'bg-gray-100' : ''} text-gray-900 hover:bg-gray-50`}
                >
                  PENDIDIKAN & PENCEGAHAN
                </button>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
        </Dialog>
        
      {/* </Disclosure> */}
    </header>
  )
}