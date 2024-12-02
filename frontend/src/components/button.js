function button(data){
    if(data.icon){
        return(
            <div style={{with: data.width}}>
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