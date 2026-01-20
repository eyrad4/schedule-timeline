import { Routes } from '@angular/router';
import {MainLayout} from "./shared/layouts/main-layout/main-layout";
import {WorkOrders} from "./features/work-orders/work-orders";

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                redirectTo: 'work-orders',
                pathMatch: 'full'
            },
            {
                path: 'work-orders',
                component: WorkOrders,
            },
        ]
    }
];
