
    export const sayhi = (): string => {
        let hour = (new Date()).getHours();

        if (hour > 18) return 'good evening';
        if (hour > 12) return 'good afternoon';
        return 'good morning'
    }