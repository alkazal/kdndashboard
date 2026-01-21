import {
  ListBulletIcon,
  CalendarIcon,
  VideoCameraIcon,
  ChevronDownIcon,
  LinkIcon,
  MapPinIcon,
  ChevronLeftIcon,
  TruckIcon
} from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function PageHeader({
  title = 'STATISTIK LESEN & PERMIT',
  period = 'Januari - Mei 2026',
  onCOPClick,
  copActive = false,
  onLaporanClick,
  laporanActive = false,
  showPenguatkuasaanActions = false
}) {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-400 dark:text-gray-500" />
            {period}
          </div>
        </div>
      </div>
      
      {showPenguatkuasaanActions && (
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <span className="hidden sm:block">
          <button
            type="button"
            onClick={onCOPClick}
            aria-pressed={copActive}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs inset-ring inset-ring-gray-300 dark:inset-ring-gray-600 transition
              ${copActive
                ? ' text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 inset-ring-gray-900'
                : ' text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'}`}
          >
            {copActive
              ?
              <ChevronLeftIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" />:
              <MapPinIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" /> 
            }
            {copActive
                ? 'BACK': 'PETA COP'}
          </button>
        </span>

        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            onClick={onLaporanClick}
            aria-pressed={laporanActive}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs inset-ring inset-ring-gray-300 dark:inset-ring-gray-600 transition
              ${laporanActive
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 inset-ring-gray-900'
                : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'}`}
          >
            <ListBulletIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" />
            LAPORAN
          </button>
        </span>

        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
          >
            <TruckIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" />
            ASET
          </button>
        </span>

        {/* <span className="sm:ml-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
            Publish
          </button>
        </span> */}

        {/* Dropdown */}
        <Menu as="div" className="relative ml-3">
          <MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50">
            UCOMM
            <ChevronDownIcon aria-hidden="true" className="-mr-1 ml-1.5 size-5 text-gray-400" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute left-0 z-10 mt-2 -mr-1 w-max origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-100 data-focus:bg-gray-100 data-focus:outline-hidden"
              >
                VIDEO CONF
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-100 data-focus:bg-gray-100 data-focus:outline-hidden"
              >
                VIDEO CALL
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-100 data-focus:bg-gray-100 data-focus:outline-hidden"
              >
                PANGGILAN
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>

        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
          >
            <VideoCameraIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" />
            CCTV
          </button>
        </span>
      </div>
      )}
    </div>
  )
}