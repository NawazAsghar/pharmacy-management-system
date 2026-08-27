'use client';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bars } from '@primeicons/react/bars';
import { Times } from '@primeicons/react/times';
import { Avatar } from '@primereact/ui/avatar';
import { Button } from '@primereact/ui/button';
import { Drawer } from '@primereact/ui/drawer';
import { Menu } from '@primereact/ui/menu';
import { NavigationMenu } from '@primereact/ui/navigationmenu';
import logo from '../assets/logo/logo_icon.png';
import api from '../API';
import {useAuth} from '../context/AuthContext'
const PHARMACIST_SECTIONS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Orders', path: '/stockOrderList' },
  { label: 'Bills', path: '/Bills' },
  { label: 'Suppliers', path: '/suppliers' },
];
const SUPPLIER_SECTIONS = [
  { label: 'Orders', path: '/stockOrderList' },
];

export default function Nav() {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getCurrentUser = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const res = await api.get('/me/');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to get current user:', err);
      setCurrentUser(null);
    }
  };

  const logOutFunc = () => {
    logout();      
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    getCurrentUser();
  }, [location.pathname]);

  return (
    <div className="mx-3 sm:mx-6 mt-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between gap-2 px-3 md:px-5 py-2.5">

        {/* Mobile Menu Drawer & Brand Logo */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
              <div className="md:hidden">
                <Drawer.Trigger as={Button} iconOnly variant="text" severity="secondary" rounded aria-label="Open menu"
                  onClick={() => setDrawerOpen(true)}
                >
                  <Bars />
                </Drawer.Trigger>
              </div>
              <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup className="w-80!">
                  <Drawer.Header>
                    <Drawer.Title>Menu</Drawer.Title>
                    <Drawer.Close as={Button} iconOnly variant="text" rounded aria-label="Close menu"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Times />
                    </Drawer.Close>
                  </Drawer.Header>
                  <Drawer.Content className="p-0">
                    <ul className="flex flex-col py-2">
                      {currentUser?.role === 'PHARMACIST' ?
                        PHARMACIST_SECTIONS.map((s) => (
                          <li key={s.label}>
                            <Link
                              to={s.path}
                              onClick={() => setDrawerOpen(false)} 
                              className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              {s.label}
                            </Link>
                          </li>
                        )) : currentUser?.role === 'SUPPLIER' ?
                          SUPPLIER_SECTIONS.map((s) => (
                            <li key={s.label}>
                              <Link
                                to={s.path}
                                onClick={() => setDrawerOpen(false)}
                                className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              >
                                {s.label}
                              </Link>
                            </li>
                          )) : " "}
                    </ul>
                  </Drawer.Content>
                </Drawer.Popup>
              </Drawer.Portal>
            </Drawer.Root>
          )}

          <div
            className="size-9 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="PharmaFlow" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Center Desktop Navigation */}
        {currentUser && (
          <NavigationMenu className="hidden! md:flex! items-center gap-1">
            {currentUser?.role === 'PHARMACIST' ?
              PHARMACIST_SECTIONS.map((s) => (
                <Link
                  key={s.label}
                  to={s.path}
                  className="px-3.5 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  {s.label}
                </Link>
              )) : currentUser?.role === 'SUPPLIER' ?
                SUPPLIER_SECTIONS.map((s) => (
                  <Link
                    key={s.label}
                    to={s.path}
                    className="px-3.5 py-2 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    {s.label}
                  </Link>
                )) : " "}
          </NavigationMenu>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Menu.Root>
              <Menu.Trigger className="rounded-full cursor-pointer outline-hidden focus:ring-4 focus:ring-sky-100">
                <Avatar.Root shape="circle" size="normal" className="bg-sky-600 text-white font-semibold border-2 border-white shadow-sm">
                  <Avatar.Fallback>{currentUser?.username?.slice(0, 2)}</Avatar.Fallback>
                </Avatar.Root>
              </Menu.Trigger>

              <Menu.Portal>
                <Menu.Positioner align="end" sideOffset={12}>
                  <Menu.Popup className="w-68 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-2xl ring-1 ring-slate-900/5">

                    {/* User Info Header */}
                    <div
                      onClick={() => navigate('/')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 cursor-pointer mb-2"
                    >
                      <Avatar.Root shape="circle" size="normal" className="bg-sky-600 text-white font-bold shrink-0 shadow-xs">
                        <Avatar.Fallback>{currentUser?.username?.slice(0, 2)}</Avatar.Fallback>
                      </Avatar.Root>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold text-slate-900 truncate">{currentUser?.username}</span>
                          {currentUser?.role && (
                            <span className="text-[10px] font-extrabold uppercase bg-sky-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                              {currentUser?.role}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 truncate mt-0.5">{currentUser?.email}</span>
                      </div>
                    </div>

                    <Menu.Separator className="my-1.5 border-t border-slate-100" />

                    <Menu.List className="flex flex-col gap-1">
                      <Menu.Group>
                        <Menu.Item
                          onClick={() => navigate('/')}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors duration-150
                                     !bg-transparent hover:!bg-slate-100/80 focus:!bg-slate-100/80 active:!bg-slate-100/90 
                                     data-[highlighted]:!bg-slate-100/80 !text-slate-700 data-[highlighted]:!text-slate-700 outline-none"
                        >
                          <div className="flex items-center justify-center size-8 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                            <i className="pi pi-user text-xs !text-slate-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="!text-slate-700">Profile</span>
                            <span className="text-[11px] !text-slate-400 font-normal">View your account details</span>
                          </div>
                        </Menu.Item>
                      </Menu.Group>

                      <Menu.Separator className="my-1.5 border-t border-slate-100" />

                      <Menu.Group>
                        <Menu.Item
                          onClick={logOutFunc}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors duration-150
                                     !bg-transparent hover:!bg-red-50/70 focus:!bg-red-50/70 active:!bg-red-100/70 
                                     data-[highlighted]:!bg-red-50/70 !text-red-600 data-[highlighted]:!text-red-600 outline-none"
                        >
                          <div className="flex items-center justify-center size-8 rounded-lg bg-red-100/70 text-red-600 shrink-0">
                            <i className="pi pi-power-off text-xs !text-red-600" />
                          </div>
                          <span className="!text-red-600">Sign Out</span>
                        </Menu.Item>
                      </Menu.Group>
                    </Menu.List>

                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}