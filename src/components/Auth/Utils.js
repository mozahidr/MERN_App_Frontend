import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

export const createOrGetUser = async (res, addUser) => {
   // const history = useHistory();
    const decode = jwtDecode(res.credential);

    const { name, picture, sub } = decode;

    const user = {
        id: sub,
        type: 'user',
        userName: name,
        image: picture
    }

    addUser(user);

    console.log(name);
    console.log(picture);
}