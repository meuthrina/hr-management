import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, BriefcaseBusiness, Building2, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types'; // Importing the Auth and NavItem types from the types file for type checking and ensuring proper structure of authentication and navigation items.
import { usePage } from '@inertiajs/react'; // Importing the usePage hook from Inertia.js to access the current page's props, including authentication information.

type Role = Auth['user']['role']; // Define a type for user roles based on the Auth type, allowing for role-based access control in the application.

type GatedNavItem = NavItem & {roles?: Role[]}; // Define a type for navigation items that may have role-based access control, allowing certain navigation items to be visible only to users with specific roles.

const mainNavItems: GatedNavItem[] = [ // Define the main navigation items for the sidebar, including their titles, hrefs, icons, and optional role-based access control.
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Departments',
        href: '/departments',
        icon: Building2,
        roles: ['admin', 'hr'], // Restricting access to the "Departments" navigation item to users with 'admin' or 'hr' roles, ensuring that only authorized users can view and access department-related features.
    },
    {
        title: 'Positions',
        href: '/positions',
        icon: BriefcaseBusiness,
        roles: ['admin', 'hr'], // Restricting access to the "Positions" navigation item to users with 'admin' or 'hr' roles, ensuring that only authorized users can view and access position-related features.
    },
    {
        title: 'Employees',
        href: '/employees',
        icon: Users,
        roles: ['admin', 'hr', 'manager'], // Restricting access to the "Employees" navigation item to users with 'admin' or 'hr' roles, ensuring that only authorized users can view and access employee-related features.
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props; // Using the usePage hook to access the current page's props, specifically the authentication information, which includes the user's role and other relevant data.
    const userRole = auth.user.role; // Extracting the user's role from the authentication information, which will be used to filter the navigation items based on role-based access control.
    const items = mainNavItems.filter((item) => !item.roles || item.roles.includes(userRole)); // Filtering the main navigation items based on the user's role, ensuring that only the navigation items that the user has access to are displayed in the sidebar.

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
