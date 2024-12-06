
import { Navigate, useNavigate, Link } from 'react-router-dom';
import './main.css';

function Community(community){
    const navigate = useNavigate();

    const OnClick = () => {
        navigate("/community/" + community.data.id);
    }

    return(
        <Link to={'/community/'+ community.data.id}>
            <div className="button" style={{marginTop: '10px', marginRight: '10px', padding: '5px 5px', lineHeight: '32px', height: '32px', width: '80%'}}> 
                <div style={{height: '100%', float: 'left'}}>
                    <img src={community.data.icon} style={{height: '100%'}} className="small_image rounded"></img>
                </div>
                <div style={{overflow: 'hidden'}}> {community.data.name}</div>
                {/* <Link to={'/community/'+ community.data.id}>link</Link> */}
                {/* <button onClick={() => OnClick() }> button</button> */}
            </div>
        </Link>
    )
}



function CommunityList(details){
    console.log(details)
    return(
        <div>
            {details.data.map((community, id) =>(
                <Community data={community} key={id} />
            ))}
        </div>
    )
}

export {
    CommunityList
}