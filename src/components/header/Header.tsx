// src/components/header/Header.tsx
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
import { Link, useLocation } from "react-router";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { useLogout } from "@/services/logout";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useUser(); 
  const { handleLogout } = useLogout();
  const location = useLocation();


  return (
    <header className="bg-dark-light-primary dark:bg-primary">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex items-stretch lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-x-2">
            <span className="bg-[url(/logo-blue.svg)] bg-no-repeat w-[10.2rem] h-12 dark:bg-[url(/logo-white.svg)]" />
          </Link>
        </div>

        {/* Botón de menú en vista móvil */}
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

        {/* Menú principal en desktop */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative"></Popover>

          <Link
            to="/"
            className={`text-sm/6 font-semibold ${
              location.pathname === "/"
                ? "underline text-primary dark:text-white"
                : "text-dark-white-primary"
            }`}
          >
            Home
          </Link>

          {currentUser && (
            <Link
              to="/new-flat"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/new-flat"
                  ? "underline text-primary dark:text-white"
                  : "text-dark-white-primary"
              }`}
            >
              New Flat
            </Link>
          )}
          {currentUser && (
            <Link
              to="/my-favorites"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/my-favorites"
                  ? "underline text-primary dark:text-white"
                  : "text-dark-white-primary"
              }`}
            >
              My Favorites
            </Link>
          )}
          {currentUser && (
            <Link
              to="/my-flats"
              className={`text-sm/6 font-semibold ${
                location.pathname === "/my-flats"
                  ? "underline text-primary dark:text-white"
                  : "text-dark-white-primary "
              }`}
            >
              My Flats
            </Link>
          )}
        </PopoverGroup>

        {/* Lado derecho en desktop: modo oscuro + avatar o login */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-4 lg:items-center">
          <ModeToggle />

          {currentUser ? (
            <PopoverUI>
              <PopoverTrigger>
                <div className="flex items-center gap-x-2">
                  {/* Muestro el nombre usando firstName */}
                  <span>Hello, {currentUser.firstName}</span>
                  <Avatar>
                    {/*
                      Si el usuario tiene `image`, la muestro.
                      Si no, uso AvatarFallback con iniciales.
                    */}
                    {currentUser.image ? (
                      <AvatarImage src={currentUser.image} className="object-cover"/>
                    ) : (
                      <AvatarFallback>
  {userProfile?.firstname ? userProfile.firstname.charAt(0) : ""}
  {userProfile?.lastname ? userProfile.lastname.charAt(0) : ""}
</AvatarFallback>

                    )}
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-y-2">
                  <Button>
                    <Link to={`/profile/${currentUser._id}`}>Profile</Link>
                  </Button>

                  
                  {currentUser.role === "admin" && (
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

      {/* Menú móvil (Dialog) */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">K-Home</span>
              <img
                alt="K-Home Logo"
                src="/logo.svg"
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
                      ? "text-primary"
                      : "text-dark-white-primary"
                  } hover:bg-gray-50`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {currentUser && (
                  <Link
                    to="/new-flat"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                      location.pathname === "/new-flat"
                        ? "text-primary"
                        : "text-dark-white-primary"
                    } hover:bg-gray-50`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    New Flat
                  </Link>
                )}
                {currentUser && (
                  <Link
                    to="/my-favorites"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                      location.pathname === "/my-favorites"
                        ? "text-primary"
                        : "text-dark-white-primary"
                    } hover:bg-gray-50`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Favorites
                  </Link>
                )}
                {currentUser && (
                  <Link
                    to="/my-flats"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                      location.pathname === "/my-flats"
                        ? "text-primary"
                        : "text-dark-white-primary"
                    } hover:bg-gray-50`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Flats
                  </Link>
                )}
              </div>

              <div className="py-6">
                <ModeToggle />

                {currentUser ? (
                  // Si el usuario está logueado, muestro un botón para cerrar sesión
                  <Button
                    className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base/7 font-semibold text-dark-white-primary hover:bg-gray-50"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                ) : (
                  // Si no está logueado, muestro el link a Login
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-dark-white-primary hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
