export class Provider {
    private static instance: Provider;
    private static singletons: Singleton<any>[] = [];

    constructor() {}

    public static getInstance(): Provider {
        if (!Provider.instance) {
            Provider.instance = new Provider();
        }
    
        return Provider.instance;
    }

    private getCreateSingletonInstance<T>(cl: new () => T): T {
        const classExistingInstance = Provider.singletons.find((instance: any) => instance instanceof cl);
        let classInstance: T;

        if (!classExistingInstance) {
            classInstance = new cl();

            Provider.singletons.push({
               instance: classInstance
            });

            return classInstance;
        }
        return classExistingInstance.instance;
    }

    getSingletonInstance<T, A extends T>(provider: {
        provide: new () => T,
        useClass: new () => A
    }): T {
        const instanceToUse = this.getCreateSingletonInstance(provider.useClass);

        return instanceToUse;
    }
}

type Singleton<T> = { instance: T };