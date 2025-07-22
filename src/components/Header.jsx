import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { LogOut, LinkIcon } from "lucide-react";
import { UrlState } from "@/Context";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();

  const { loading, fn: fnLogout } = useFetch(logout);

  return (
    <>
      <nav className="py-4 flex justify-between items-center gap-2">
        <Link to="/">
          <img src="/Logo.jpg" alt="Trimmer Logo" className="h-16" />
        </Link>

        <div>
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>Chudasama Vihar</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-yellow-400">
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    <span>My Links</span>
                  </Link>
                  
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser();
                        navigate("/");
                      });
                    }}
                  >
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
