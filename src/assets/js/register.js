export async function register(params){
    const {cardId,
        name,
        pass,
        phone,
        companyName,
        companyManager
    }=params
    return request(REGISTER_ACCOUNT,'post',{
        id:cardId,
        name,
        pwd:pass,
        phone,
        legal_person:companyManager,
        company_name:companyName
    })
}
export async function login(params){
    return request(LOGIN,'post',params)
}
