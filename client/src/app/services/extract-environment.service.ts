import { Injectable } from '@angular/core';

//  services
import { TopologyTypeService } from './topologytype.service';

// Models
import { TopologyEnvironment } from './../shared/models/topologyenvironment';
import { TopologyType } from './../shared/models/topologytype';

@Injectable()
export class ExtractEnvironmentService {

    topologyType: TopologyType[];

    constructor(private topologyTypeService:TopologyTypeService) { }

    loadScript(environment: TopologyEnvironment): void {
        this.topologyTypeService.GetAll()
                .subscribe(m => this.topologyType = m);

    }
}
