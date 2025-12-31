import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="w-full h-14 px-4 border-b shadow-sm bg-background flex items-center">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-x-4">
          <Link href="/">
            <h1>Todo app</h1>
          </Link>
        </div>
        <div>Buttons</div>
      </div>
    </div>
  );
}

export default NavBar;
