import { useHttp } from "../hooks/http.hook"


const useMarvelServices = () => {

    const { loading, request, error, clearError } = useHttp();

    const _apiBase = "https://gateway.marvel.com/v1/public/comics"
    const _apiKey = "1bf0a3a55fc46c79fbf4399cf97700e6"
    const _offset = 0;
    const _limit = 10;

    const getData = async (offset = _offset, text, year) => {
        let apiText = ''
        let apiYear = ''
        if (text) {
            apiText = `titleStartsWith=${text}&`
        }
        if (year) {
            apiYear = `startYear=${year}&`
        }
        const res = await request(`${_apiBase}?${apiText}${apiYear}limit=${_limit}&offset=${offset}&apikey=${_apiKey}`)
        const data = await res.data
        return data
    }

    const transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description ? `${comics.description}` : "There is no description for this comics",
            thumbnail: comics.thumbnail.path + '/portrait_small.' + comics.thumbnail.extension,
        }
    }
    return { loading, error, getData, transformComics, clearError }
}

export default useMarvelServices;