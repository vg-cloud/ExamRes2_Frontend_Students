'use client'

import { FC } from 'react';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const Header: FC = () => {
  const [time, setTime] = useState('hh:mm');
  const { setTheme } = useTheme()
  
  useEffect(() => {
    const refreshTime = async () => {
      const date = new Date();
      setTime(date.toLocaleTimeString());
    };
    refreshTime();
    const intervalId = setInterval(() => {
      refreshTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className='bg-secondary mx-auto flex max-w-screen-2xl flex-row items-center justify-between p-5 sticky top-0'>
      <div className='flex flex-row items-center gap-7'></div>
      <div className='flex flex-row items-center gap-7'>
        <Image
          className="dark:invert"
          src="/exam_icon.png"
          alt="Exam"
          width={40}
          height={40}
        />
      </div>
      <div className='flex flex-row items-center gap-7'>
        {time}
      </div>
      <div className='flex flex-row items-center gap-7'>
        <a href=''>Exam results</a>
      </div>
      <div className='flex flex-row items-center gap-7'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex flex-row items-center gap-7'></div>
    </div>
  )
}