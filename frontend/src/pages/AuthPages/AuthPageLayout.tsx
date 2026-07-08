import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        
        {/* 🎯 Right-Side Visual Identity Panel */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 lg:grid border-l border-gray-200/10 relative overflow-hidden">
          <div className="relative flex items-center justify-center z-1 w-full h-full px-8">
            
            {/* Preserved Grid Asset Background Line Mesh */}
            <GridShape />
            
            <div className="flex flex-col items-center max-w-md text-center z-10 px-4">
              {/* Custom Hour-Credit Emblem */}
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl mb-6 animate-pulse">
                ⏳
              </div>

              <Link to="/" className="block mb-3">
                <span className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
                  TimeBank
                </span>
              </Link>
              
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6" />

              <h2 className="text-xl font-bold text-indigo-100 tracking-wide mb-3 uppercase text-xs">
                Exchange Skills • Earn Time Credits
              </h2>
              
              <p className="text-sm leading-relaxed text-gray-300 dark:text-gray-400 font-normal max-w-sm">
                Join a mutual-aid marketplace where one hour of your service directly equals one time credit to purchase assistance from anyone else in the network.
              </p>
            </div>

          </div>
        </div>

        {/* Theme Switching Core Asset Floating Toggle */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}