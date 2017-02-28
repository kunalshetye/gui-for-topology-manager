import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NavigationItem } from './../shared/models/navigationitem';
import { RouteConst } from './../shared/constants';
import { ContextService } from './../services/context.service';


@Component({
    moduleId: module.id,
    selector: 'nav-container',
    templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit {
    navItems: NavigationItem[];
    currentEnvironment: String;
    subscription: Subscription;
    constructor(private contextService: ContextService) {
         this.subscription = this.contextService.GetEnvironmentChangeAsObservable()
                            .subscribe(m => this.setCurrentEnvironment(m.Name));
     }

    ngOnInit() {
        this.getNavItems();

    }

    private setCurrentEnvironment(name: string): void {
        this.currentEnvironment = name;
    }

    private getNavItems(): void {
       this.navItems = NavigationItem[2] = [
            new NavigationItem('Home', 'main'),
            new NavigationItem('Select Environment', RouteConst.EnvironmentSelectionPath),
            new NavigationItem('CM Environment', RouteConst.CmEnvironmentOverviewPath),
            new NavigationItem('Topology Types', RouteConst.TopologyTypeOverViewPath),
            new NavigationItem('CD Environments', RouteConst.EnvironmentOverviewPath),
            new NavigationItem('Websites', RouteConst.WebsiteOverviewPath),
            new NavigationItem('WebApplications', RouteConst.WebApplicationOverviewPath),
            new NavigationItem('Mappings', RouteConst.MappingOverviewPath),
        ];
    }
}
