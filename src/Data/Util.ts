import axios from "axios";
import { CategoryTree } from "./ProductData";
import { domain } from "./Settings";

export const getTreePath = (tree: CategoryTree | undefined, id: number): number[] => {
    if(!tree || tree.length === 0){
        return [];
    }
    let path: number[] = [];
    for(let i = 0; i < tree.length; i++){
        const currentRoot = tree[i];
        path.push(currentRoot.categoryId);
        if(currentRoot.categoryId === id){
            return path;
        }
        const nextPaths = getTreePath(currentRoot.children, id);
        if(nextPaths.length > 0){
            path = path.concat(nextPaths);
            break;
        }
        path.pop();
    }
    return path;
}

export const getCategoryNameById = (tree: CategoryTree | undefined, id: number): string => {
    if(!tree || tree.length === 0){
        return '';
    }
    for(let i = 0; i < tree.length; i++){
        const currentRoot = tree[i];
        if(currentRoot.categoryId === id){
            return currentRoot.name;
        }
        if(currentRoot.children.length > 0){
            const candidate = getCategoryNameById(currentRoot.children, id);
            if(candidate.length > 0){
                return candidate;
            }
        }
    }

    return '';
}

const urlToFile = async (url: string): Promise<File> => {
    const fileName = url.split('/').pop() || 'unknown_file';
    
    const response = await axios.get(url, {
        responseType: 'blob',
    });
    
    const blob = response.data;
    const fileType = blob.type || 'application/octet-stream';
    
    return new File([blob], fileName, { type: fileType });
}

export const loadImages = async (images: string[]): Promise<File[]> => {
    if(images.length === 0){
        return [];
    }
    return Promise.all(images.map(image => urlToFile(`${domain}${image}`)));
}