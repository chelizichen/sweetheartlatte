class S_Errors extends Error {
    public err:any
    public iCode:number;
    public iMessage:string;
    constructor(err:any) {
        super(err.message);
        this.iMessage = err.message;
        this.iCode = err.code;
    }
}
export const ConnectionError  = () => new S_Errors({ code: -1, message: 'error:链接失败' })
export const RespError  = () => new S_Errors({ code: -1, message: 'error:返回报错' })