import { useParams } from "react-router-dom";

export default function PlacePage (){
    const {id} = useParams();
    return(
        <div>place page: {id}</div>
    )
}