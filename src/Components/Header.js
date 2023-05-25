import DarkModeToggle from "./DarkModeToggle";
import CanvasCustom from "./Canvas";
import MainCanvas from "./MainCanvas";
import CanvasNew from "./Canvas2";

const items = [
  { name: "Home", id: "home" },
  { name: "Projects", id: "projects" },
  { name: "About Me", id: "about-me" },
  { name: "Contact", id: "contact" },
];
function CreateNavItems() {
  let navItems = [];
  const sharedClasses = "nav-button block py-2 pl-3 pr-4 rounded md:p-0 dark:text-white ";
  const nonSelectedClasses =
    sharedClasses +
    " text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  const selectedClasses = sharedClasses + " text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 aria-current='page'";

  function OnNavClick(itemId) {
    console.log("finding: " + itemId);
    const items = document.getElementsByClassName("nav-button");
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      if (element.id == itemId + "-button") {
        console.log("Changing: " + itemId);

        element.className = selectedClasses;
      } else {
        element.className = nonSelectedClasses;
      }
    }
  }
  for (let i = 0; i < items.length; i++) {
    const element = items[i];

    function SetClass(index) {
      if (index == 0) {
        return selectedClasses;
      } else {
        return nonSelectedClasses;
      }
    }
    let navItem = (
      <li>
        <a key={element.id} id={element.id + "-button"} href={`#${element.id}`} className={SetClass(i)} onClick={() => OnNavClick(element.id)}>
          {element.name}
        </a>
      </li>
    );
    navItems.push(navItem);
  }
  OnNavClick("home");

  return navItems;
}
function DropDownMenu() {
  return (
    <button
      data-collapse-toggle='navbar-default'
      type='button'
      className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
      aria-controls='navbar-default'
      aria-expanded='false'
    >
      <span className='sr-only'>Open main menu</span>
      <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
        <path
          fillRule='evenodd'
          d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
          clipRule='evenodd'
        ></path>
      </svg>
    </button>
  );
}
function Header() {
  return (
    <div className='flex flex-col h-screen max-w-screen p-10 z-10'>
      <div className='flex flex-col flex-grow w-full h-full relative border border-zinc-800'>
        {/* <canvas className='main-canvas -z-10 absolute w-full h-full'></canvas> */}
        {/* <MainCanvas /> */}
        <CanvasNew />
        <nav className=''>
          <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pt-2'>
            <h1 className='text-gray-900 dark:text-white'>Hello, I'm Daniel.</h1>

            <div className='hidden w-full md:block md:w-auto' id='navbar-default'>
              <ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-zinc-800 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:border-zinc-800'>{CreateNavItems()}</ul>
            </div>
            <DarkModeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
