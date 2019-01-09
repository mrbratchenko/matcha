import React from "react";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-5 p-4 text-center navbar-bottom">
      Copyright &copy; {new Date().getFullYear()} Matches
    </footer>
  );
}
