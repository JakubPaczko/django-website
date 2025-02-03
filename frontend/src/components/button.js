function button(data){
    if(data.icon){
        return(
            <a href={data.url}>
                <div style={{with: data.width}}>
                    {/* {data.icon ? <img src=""></img> : <></>} */}
                    <img src=""></img>
                    <div> {data.content} </div>
                </div>
            </a>
        )
    }
    else{
        return(
            <a>
                <div style={{with: data.width}}>
                    <div> {data.content} </div>

                </div>
            </a>
        )
    }
    
}

export {
    button,
};