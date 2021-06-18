
class HttpService {
    private static httpService = new HttpService();

    private constructor() { }

    static start() {
        return this.httpService;
    }

    // asyncFetch2 = async (url: string, requestOptions?: RequestInit): Promise<any> => {
    //     return await fetch(url, requestOptions)
    //         .then(response => response.text())
    //         .then(
    //             (result) => {
    //                 console.log('result: ffffffff ', result)
    //                 return result
    //             },
    //             (error) => {
    //                 console.log('error: ', error)
    //             }
    //         )
    // }

    // ***
    asyncFetch = async (url: string, requestOptions?: RequestInit): Promise<string> => {
        let response: Response;

        response = await fetch(url, requestOptions)

        return await response.text();
    }

    decode = (str: string) => {
        return JSON.parse(str);
    }
}

export default HttpService;