import { useEffect, useState } from 'react';
import './App.css';
import Comics from './components/Comics';
import useMarvelServices from "./services/MarvelService";
import { AppBar, Typography, Input, Pagination } from '@mui/material'
import style from "./css_modules/main.module.css"
import { useDebounce } from 'usehooks-ts'
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import Spinner from "./components/spinner/Spinner"
import ErrorMessage from './components/errorMessage/ErrorMessage';



function App() {

  const [data, setData] = useState([]);
  const [text, setText] = useState("")
  const [year, setYear] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(10)
  const debouncedText = useDebounce(text, 1500)
  const debouncedYear = useDebounce(year, 1500)
  const [message, setMessage] = useState("")

  const { loading, error, getData, transformComics, clearError } = useMarvelServices()

  useEffect(() => {
    clearError()
    getData(0, text, year)
      .then(data => {
        
        if (data.total) {
          setMessage("")
         
          setTotal(Math.ceil(data.total / 10))
          setData(data.results.map(transformComics))
          setPage(1)
        } else {
          setTotal(Math.ceil(data.total / 10))
          setData([])
          setPage(1)
          setMessage("No comics")
        }
      })
  }, [debouncedText, debouncedYear]);

  const handleClickPagin = (_, numPage) => {
    
    if (numPage <= total) {
      setPage(numPage)
      clearError()
      getData(numPage * offset - offset, text, year)
        .then(data => {
          
          if (data.total) {
            setTotal(Math.ceil(data.total / 10))
            setData(data.results.map(transformComics))
          } else {
            setData([])
            setMessage("No comics")
          }
        })
      
    }
  }



  const hadleChangeYear = (e) => {
    const res = e.currentTarget.value;
    
    const res2 = res.match(/\d{1,4}/g);
    if (res2) {
      setYear(+res2[0])
    } else {
      setYear('')
      setMessage("")
    }
  }

  const handleChangeText = (e) => {
    const res = e.currentTarget.value
    if (res) {
      setText(res)
    } else {
      setText('')
      setMessage("")
    }
  }

  const spinner = loading && !error ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !loading ? <Comics data={data} message={message} /> : null;

  return (
    <div className={style.App}>
      <AppBar position="static" sx={{ height: 100 }} className='d-flex align-items-center pt-4'>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 32 }}>
          Marvel App
        </Typography>
      </AppBar>
      <div className={` mt-3 d-flex justify-content-between`} direction="vertical">
        <div className="filters ms-5">
          Filter by
          <Input
            value={text}
            onChange={handleChangeText}
            className='ms-5'
            label="Standard warning"
            variant="standard"
            color="warning"
            placeholder="Comics name"
          />
          <Input
            value={year}
            onChange={hadleChangeYear}
            className='ms-5'
            placeholder="Start year"
            name="startYear"
            type='number'

          />
        </div>
        {spinner}
        <Pagination
          page={page}
          onChange={handleClickPagin}
          count={total}
          variant="outlined"
          shape="rounded" />
      </div>
      {errorMessage}
      <ErrorBoundary>
        {content}
      </ErrorBoundary>
    </div>
  );
}

export default App;
