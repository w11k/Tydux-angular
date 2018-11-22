import {InjectionToken, ModuleWithProviders, NgModule} from "@angular/core";
import {enableTyduxDevelopmentMode, TyduxReducerBridge, TyduxStore} from "@w11k/tydux";
import {createStore, Reducer, Store, StoreEnhancer} from "redux";

export const REDUX_STORE = new InjectionToken("ReduxStoreByTyduxToken");
export const tyduxModuleConfiguration = new InjectionToken("TyduxModuleConfiguration");

export interface TyduxConfiguration {
    reducer?: Reducer;
    storeEnhancer?: StoreEnhancer;
    developmentMode?: boolean;
}

export interface TyduxModuleConfiguration {
    initialState: any;
    configFactory?: () => TyduxConfiguration;
}

@NgModule({
    imports: [],
    providers: [
        TyduxReducerBridge,
        {
            provide: REDUX_STORE,
            deps: [tyduxModuleConfiguration, TyduxReducerBridge],
            useFactory: (tmc: TyduxModuleConfiguration, bridge: TyduxReducerBridge) => {
                const config = tmc.configFactory ? tmc.configFactory() : {};
                const initialState = Object.assign({}, tmc.initialState);
                const reducer = config.reducer ? config.reducer : (state: any) => state;

                if (config.developmentMode !== undefined) {
                    enableTyduxDevelopmentMode(config.developmentMode);
                }

                return createStore(
                    bridge.wrapReducer(reducer),
                    initialState,
                    config.storeEnhancer);
            }
        },
        {
            provide: TyduxStore,
            deps: [REDUX_STORE, TyduxReducerBridge],
            useFactory: (redux: Store, bridge: TyduxReducerBridge) => {
                return bridge.connectStore(redux);
            }
        }
    ]
})
export class TyduxModule {

    static forRoot(initialState: any = {},
                   configFactory?: () => TyduxConfiguration): ModuleWithProviders {
        return {
            ngModule: TyduxModule,
            providers: [
                {
                    provide: tyduxModuleConfiguration,
                    useValue: {initialState, configFactory} as TyduxModuleConfiguration
                }
            ]
        };
    }

}
