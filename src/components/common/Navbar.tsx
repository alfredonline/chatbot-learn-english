import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  return (
    <MaxWidthWrapper className="fixed top-0 w-full z-50 right-0 left-0 bg-background/80 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={"/"} className="font-bold">
            Lingjo
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          {authenticated ? (
            <LogoutLink>Log out</LogoutLink>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                Log in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  className:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                Sign up
              </RegisterLink>
            </div>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"} className="w-[300px] sm:w-[400px]">
                <SheetTitle className="font-bold">Lingjo</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent/10"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col space-y-4 pt-4 border-t border-border">
                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Log in
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({
                      className:
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    })}
                  >
                    Sign up
                  </RegisterLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};

export default Navbar;
