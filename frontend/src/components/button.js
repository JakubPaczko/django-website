function button(data){
    if(data.icon){
        return(
            <div style={{with: data.width}}>
                {/* {data.icon ? <img src=""></img> : <></>} */}
                <img src=""></img>
                <div> {data.content} </div>
            </div>
        )
    }
    else{
        return(
            <div style={{with: data.width}}></div>
        )
    }
    
}

export {
    button,
};