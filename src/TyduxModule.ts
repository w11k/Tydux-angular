import {ModuleWithProviders, NgModule} from "@angular/core";
import {TyduxReducerBridge, TyduxStore} from "@w11k/tydux";
import {createStore, StoreEnhancer} from "redux";

export const REDUX_STORE = "ReduxStoreByTyduxToken";

@NgModule()
export class TyduxModule {

    static forRoot(initialState: any, enhancer?: StoreEnhancer<any>): ModuleWithProviders {
        const bridge = new TyduxReducerBridge();
        const reduxStore = createStore(bridge.createTyduxReducer(initialState), enhancer);
        const tyduxStore = bridge.connectStore(reduxStore);

        return {
            ngModule: TyduxModule,
            providers: [
                {provide: TyduxStore, useValue: tyduxStore},
                {provide: REDUX_STORE, useValue: reduxStore}
            ]
        };
    }

}
