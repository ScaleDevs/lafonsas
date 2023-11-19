import { useState } from 'react';
import Link from 'next/link';
import useAppStoreTrack from '@/store/app.store';
import { useLogout } from '@/modules/hooks/useLogout.hook';
import FadeIn from '@/components/FadeIn';
import IconComp from '@/components/Icon';

interface NavLinkHouseItem {
  path: string;
  title: string;
}

interface INavLinkHouseProps {
  title: string;
  Icon?: () => JSX.Element;
  links: NavLinkHouseItem[];
}

const NavLinkHouse = ({ title, Icon, links }: INavLinkHouseProps) => {
  const [collapse, setCollapse] = useState(false);

  const LinkItem = ({ children, path }: { children: any; path: string }) => (
    <Link href={path} passHref>
      <div className='text-md rounded-md p-3 text-black hover:cursor-pointer hover:bg-gray-300'>{children}</div>
    </Link>
  );

  const IconTitle = () => {
    if (Icon)
      return (
        <>
          <Icon />
          <div className='px-1' />
        </>
      );

    return null;
  };

  return (
    <li>
      <FadeIn>
        <div
          className='flex w-full flex-row justify-between rounded-md p-3 hover:cursor-pointer hover:bg-gray-300'
          onClick={() => setCollapse((curr) => !curr)}
        >
          <div className='flex flex-row items-center text-black'>
            <IconTitle />
            {title}
          </div>
          {collapse ? (
            <IconComp iconName='ChevronUpIcon' iconProps={{}} />
          ) : (
            <IconComp iconName='ChevronDownIcon' iconProps={{}} />
          )}
        </div>
      </FadeIn>

      <div
        className={`ml-4 border-l-2 transition-[max-height] duration-500 ${
          collapse ? 'max-h-56 ease-in' : 'max-h-0'
        } overflow-hidden border-gray-600`}
      >
        {links.map(({ title, path }, index) => (
          <LinkItem key={index} path={path}>
            {title}
          </LinkItem>
        ))}
      </div>
    </li>
  );
};

interface INavLinkProps {
  children: any;
  path: string;
  logout?: boolean;
  houseItems?: boolean;
  Icon?: () => JSX.Element;
}

const NavLink = ({ children, path, logout, Icon }: INavLinkProps) => {
  const { signOutWithMutate } = useLogout();

  const IconComp = () => {
    if (Icon)
      return (
        <>
          <Icon />
          <div className='px-1' />
        </>
      );

    return null;
  };

  if (logout)
    return (
      <li onClick={() => signOutWithMutate()}>
        <FadeIn cssText='p-3 w-full rounded-md hover:bg-gray-300 hover:cursor-pointer flex flex-row items-center text-black'>
          <IconComp />
          {children}
        </FadeIn>
      </li>
    );

  return (
    <li>
      <FadeIn cssText='rounded-md hover:bg-gray-300 hover:cursor-pointer text-black'>
        <Link href={path} passHref>
          <a className='flex flex-row items-center p-3'>
            <IconComp />
            {children}
          </a>
        </Link>
      </FadeIn>
    </li>
  );
};

export default function SideNav() {
  const { sideNavOpen, setAppState } = useAppStoreTrack();

  const toggleSideNav = () => setAppState('sideNavOpen', !sideNavOpen);

  return (
    <>
      <button onClick={toggleSideNav} className='absolute p-3 sm:hidden'>
        <IconComp iconName='HamburgerIcon' iconProps={{ isButton: true }} />
      </button>
      <div
        className={`${
          sideNavOpen ? 'w-[70%] sm:w-64' : 'w-0 sm:w-[3.5rem]'
        } absolute  z-10 h-full overflow-hidden bg-white shadow-lg transition-[width] duration-500 sm:relative sm:w-64`}
      >
        {sideNavOpen ? (
          ''
        ) : (
          <div className={`w-full ${sideNavOpen ? 'flex flex-row' : 'hidden'} justify-end p-3 sm:flex sm:flex-row`}>
            <FadeIn cssText={`w-full flex flex-row justify-center p-3 ${sideNavOpen ? 'hidden' : ''}`}>
              <button onClick={toggleSideNav}>
                <IconComp iconName='ArrowCircleRightIcon' iconProps={{ isButton: true }} />
              </button>
            </FadeIn>
          </div>
        )}

        <div className={sideNavOpen ? 'divide-y text-gray-200' : ''}>
          <div className={sideNavOpen ? 'p-5 font-comfortaa text-3xl font-bold text-primary' : 'hidden'}>Lafonsas</div>

          <div className={sideNavOpen ? 'w-full py-3' : 'hidden'}>
            <ul className='font- mx-auto w-[90%] font-comfortaa text-lg'>
              {/* <NavLink path='/' Icon={() => <IconComp iconName='BarChartIcon' iconProps={{}} />}>
                Dashboard
              </NavLink> */}
              {/* <NavLink path='/user-management' Icon={() => <IconComp iconName='UsersIcon' iconProps={{}} />}>
                Users
              </NavLink> */}
              <NavLinkHouse
                title='Delivery'
                Icon={() => <IconComp iconName='BoxIcon' iconProps={{}} />}
                links={[
                  { title: 'Create Delivery', path: '/delivery/create' },
                  { title: 'List Delivery', path: '/delivery' },
                ]}
              />
              <NavLinkHouse
                title='Store'
                Icon={() => <IconComp iconName='BoxIcon' iconProps={{}} />}
                links={[
                  { title: 'Create Store', path: '/store/create' },
                  { title: 'List Stores', path: '/store' },
                ]}
              />
              <NavLinkHouse
                title='Accounts'
                Icon={() => <IconComp iconName='BoxIcon' iconProps={{}} />}
                links={[
                  { title: 'Create Accounts', path: '/accounts/create' },
                  { title: 'List Accounts', path: '/accounts' },
                ]}
              />
              <NavLinkHouse
                title='Bills'
                Icon={() => <IconComp iconName='BoxIcon' iconProps={{}} />}
                links={[
                  { title: 'Create Bill', path: '/bill/create' },
                  { title: 'List Bills', path: '/bill' },
                  { title: 'List Expenses', path: '/bill/expenses' },
                ]}
              />
              <NavLinkHouse
                title='Payments'
                Icon={() => <IconComp iconName='BoxIcon' iconProps={{}} />}
                links={[
                  { title: 'Create Payment', path: '/payment/create' },
                  { title: 'List Payments', path: '/payment' },
                ]}
              />
              <NavLink path='/login' logout Icon={() => <IconComp iconName='LogoutIcon' iconProps={{}} />}>
                Logout
              </NavLink>
            </ul>
          </div>

          <FadeIn cssText={`w-full flex flex-row justify-center px-3 pt-10 ${sideNavOpen ? '' : 'hidden'}`}>
            <button onClick={toggleSideNav}>
              <IconComp iconName='ArrowCircleLeftIcon' iconProps={{ isButton: true }} />
            </button>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
