import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverGroup,
} from "@headlessui/react";
import {
  Popover as PopoverUI,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-ttogle";
import { Link, useLocation } from "react-router"; // Importa useLocation
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { useLogout } from "@/services/logout";
import { IconHomeFilled } from "@tabler/icons-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useUser();
  const { handleLogout } = useLogout();
  const location = useLocation();

  return (
    <header className="bg-dark-light-primary">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex items-stretch lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-x-2">
            <span className="sr-only">Your Company</span>
            <span>
              <IconHomeFilled className="text-indigo-700 dark:text-white size-10" />
            </span>
            <span className="text-lg text-indigo-700 dark:text-white">
              FlatFinder
            </span>
          </Link>
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
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative"></Popover>

          <Link
            to="/"
            className={`text-sm/6 font-semibold ${
              location.pathname === "/"
                ? "underline text-indigo-400"
                : "text-dark-white-primary"
            }`}
          >
            Home
          </Link>
          {userProfile && (
            <Link
              to="/new-flat"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/new-flat"
                  ? "underline text-indigo-400"
                  : "text-dark-white-primary"
              }`}
            >
              New Flat
            </Link>
          )}
          {userProfile && (
            <Link
              to="/my-favorites"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/my-favorites"
                  ? "underline text-indigo-400"
                  : "text-dark-white-primary"
              }`}
            >
              My Favorites
            </Link>
          )}
          {userProfile && (
            <Link
              to="/my-flats"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/my-flats"
                  ? "underline text-indigo-400"
                  : "text-dark-white-primary"
              }`}
            >
              My Flats
            </Link>
          )}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-4 lg:items-center">
          <ModeToggle />
          {userProfile ? (
            <PopoverUI>
              <PopoverTrigger>
                <div className="flex items-center gap-x-2">
                  <span>{userProfile.firstname}</span>
                  <Avatar>
                    <AvatarImage
                      src={`https://ggdyznkijkikcjuonxzz.supabase.co/storage/v1/object/public/avatars/${userProfile.avatar}`}
                    />
                    <AvatarFallback>
                      {userProfile.firstname}
                      {userProfile.lastname}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-y-2">
                  <Button>
                    <Link to={`/profile/${userProfile.id}`}>Profile</Link>
                  </Button>
                  {userProfile.isadmin && (
                    <Button>
                      <Link to="/admin">Users</Link>
                    </Button>
                  )}
                  <Button onClick={handleLogout}>Log out</Button>
                </div>
              </PopoverContent>
            </PopoverUI>
          ) : (
            <Link
              to="/login"
              className="text-sm/6 font-semibold text-dark-white-primary"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
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
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-dark-white-primary hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2"></DisclosurePanel>
                </Disclosure>
                <Link
                  to="/"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                    location.pathname === "/"
                      ? "text-indigo-600"
                      : "text-dark-white-primary"
                  } hover:bg-gray-50`}
                >
                  Home
                </Link>
                <Link
                  to="/new-flat"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                    location.pathname === "/new-flat"
                      ? "text-indigo-600"
                      : "text-dark-white-primary"
                  } hover:bg-gray-50`}
                >
                  New Flat
                </Link>
                {userProfile && (
                  <Link
                    to="/my-favorites"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                      location.pathname === "/my-favorites"
                        ? "text-indigo-600"
                        : "text-dark-white-primary"
                    } hover:bg-gray-50`}
                  >
                    My Favorites
                  </Link>
                )}
                {userProfile && (
                  <Link
                    to="/my-flats"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                      location.pathname === "/my-flats"
                        ? "text-indigo-600"
                        : "text-dark-white-primary"
                    } hover:bg-gray-50`}
                  >
                    My Flats
                  </Link>
                )}
              </div>
              <div className="py-6">
                <ModeToggle />
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-dark-white-primary hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
