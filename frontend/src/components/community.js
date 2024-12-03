
import './main.css';

function Community(community){
    return(
        <a href='' style={{lineHeight: '32px', width: '80%'}}>
            <div className="button" style={{marginTop: '10px', marginRight: '10px', padding: '5px 5px', lineHeight: '32px', height: '32px'}}> 
                <div style={{height: '100%', float: 'left'}}>
                    <img src={community.data.icon} style={{height: '100%'}} className="small_image rounded"></img>
                </div>
                <div style={{overflow: 'hidden'}}> {community.data.name}</div>
            </div>
        </a>
    )
}

function CommunityList(details){
    console.log(details)
    return(
        <div>
            {details.data.map((community, id) =>(
                <Community data={community}/>
            ))}
        </div>
    )
}

export {
    CommunityList
}