import React, { MouseEvent, useEffect, useState } from 'react';
import './Styles/Header.scss';
import MenuIcon from '@mui/icons-material/Menu';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import { CategoryTree, getCategoryTree } from '../Data/ProductData';
import { isErrorMessage } from '../Data/Util';
import { useSelector } from 'react-redux';
import { GlobalState } from '../Data/GlobalState/Store';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuContentType, setMenuContentType] = useState<MenuContentType>('categories');
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>, menuContentType: MenuContentType) => {
        setAnchorEl(event.currentTarget);
        setMenuContentType(menuContentType);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="HeaderContainer">
            <div className='Header'>
                <div className="Group">
                    <div className="Categories" onClick={(e) => handleClick(e, 'categories')}>
                        <MenuIcon />
                        <span>Categories</span>
                    </div>
                    <Link to={'/'} style={{textDecoration: 'none'}}>
                        <div className="Logo">
                            <ThumbUpIcon />
                            <div className="LogoLetter">
                                <span>ThumbsUp</span>
                                <span>Groceries</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="Group SearchGroup">
                    <Box
                        className='SearchBar'
                        component='form'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const data = new FormData(e.currentTarget);
                            const search = data.get('search');

                            navigate(`/products?search=${search}`);
                        }}
                    >
                        <TextField
                            name='search'
                            placeholder='Search...'
                            variant='standard'
                            fullWidth
                            slotProps={{
                                input: {
                                    disableUnderline: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit" edge="end">
                                                <SearchIcon sx={{ color: '#1976d2' }} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>
                </div>
                <div className="Group">
                    <div className="UserRelated">
                        <div className='My' onClick={(e) => handleClick(e, 'my')}>
                            <PersonIcon />
                            <span>My</span>
                        </div>
                        <Link to={'/trolley'} style={{textDecoration: 'none'}}>
                            <div className='Trolley'>
                                <ShoppingCartIcon />
                                <span>Trolley</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <MenuContent
                    anchorEl={anchorEl}
                    open={open}
                    handleClose={handleClose}
                    contentType={menuContentType}
                />
            </div>
        </div>
    );
};

type MenuContentType = 'categories' | 'my';

const MenuContent = ({
    anchorEl,
    open,
    handleClose,
    contentType
}: {
    anchorEl: null | HTMLElement,
    open: boolean,
    handleClose: () => void,
    contentType: MenuContentType
}) => {
    const navigate = useNavigate();

    const userRole = useSelector((state: GlobalState) => state.user.info?.role);
    
    const [ selectedCategories, setSelectedCategories ] = useState<number[]>([]);
    const [ categoryOptionLists, setCategoryOptionLists ] = useState<(CategoryTree | null)[]>([null, null, null]);
    const [ currentCategoryLevel, setCurrentCategoryLevel ] = useState(0);
    const selectedCategoryId1 = selectedCategories[0];
    const selectedCategoryId2 = selectedCategories[1];
    
    useEffect(() => {
        const getCategories = async () => {
            const response = await getCategoryTree();
            if(isErrorMessage(response)){
                return;
            }
            
            const newCategoryTree = response as CategoryTree;
            setCategoryOptionLists([
                newCategoryTree,
                null,
                null
            ])
        }

        getCategories();
    }, [])

    useEffect(() => {
        setCategoryOptionLists(prev => ([
            prev[0],
            prev[0]?.find(categoryItem => categoryItem.categoryId === selectedCategoryId1)?.children ?? null,
            null
        ]))
    }, [selectedCategoryId1])

    useEffect(() => {
        setCategoryOptionLists(prev => ([
            prev[0],
            prev[1],
            prev[1]?.find(categoryItem => categoryItem.categoryId === selectedCategoryId2)?.children ?? null
        ]))
    }, [selectedCategoryId2])

    let menuContent = <></>;
    if(contentType === 'categories'){
        const currentCategory = categoryOptionLists[currentCategoryLevel - 1]?.find(categoryItem => categoryItem.categoryId === selectedCategories[currentCategoryLevel - 1]);

        menuContent = (<>
            {currentCategoryLevel > 0 &&<>
                <MenuItem 
                    onClick={() =>{
                        setSelectedCategories(prev => prev.slice(0, -1));
                        setCurrentCategoryLevel(prev => prev - 1);
                    }}
                >
                    <span style={{color: '#1976d2'}}>Back</span>
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        navigate(`/products/categories/${currentCategory?.categoryId}`);
                        handleClose();
                    }}
                >
                    <span style={{color: '#63a4ff'}}>All {currentCategory?.name}</span>
                </MenuItem>
            </>}
            {currentCategoryLevel < 2 ? 
                (categoryOptionLists[currentCategoryLevel]?.map(categoryItem => (
                    <MenuItem
                        onClick={() => {
                            setSelectedCategories(prev => [...prev, categoryItem.categoryId]);
                            setCurrentCategoryLevel(prev => prev + 1);
                        }}
                    >
                        {categoryItem.name}
                    </MenuItem>)
                ))
                : 
                (categoryOptionLists[currentCategoryLevel]?.map(categoryItem => (
                    <MenuItem onClick={() => {
                        navigate(`/products/categories/${categoryItem.categoryId}`);
                        handleClose();
                    }}>
                        {categoryItem.name}
                    </MenuItem>)
                ))
            }
        </>)
    }
    else if(contentType === 'my'){
        if(userRole){
            if(userRole === 'Admin'){
                menuContent = (<>
                    <MenuItem onClick={() => {
                        navigate('/admin/products');
                        handleClose();
                    }}>
                        Admin
                    </MenuItem>
                </>)
            } else if(userRole === 'Customer'){
                menuContent = (<>
                    <MenuItem onClick={() => {
                        navigate('/account/details');
                        handleClose();
                    }} >
                        Details
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate('/account/orders');
                        handleClose();
                    }} >
                        Orders
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate('/account/membership');
                        handleClose();
                    }} >
                        Membership
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        navigate('/');
                        window.location.reload();
                    }} >
                        Sign Out
                    </MenuItem>
                </>)
            }
        }
        else{
            menuContent = (<>
                <MenuItem onClick={() => {
                    navigate('/signin');
                    handleClose();
                }} >
                    Sign In
                </MenuItem>
                <MenuItem onClick={() => {
                    navigate('/signup');
                    handleClose();
                }} >
                    Sign Up
                </MenuItem>
            </>);
        }
    }
    
    return(
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => {
                handleClose();
                setTimeout(() => {
                    setSelectedCategories([]);
                    setCurrentCategoryLevel(0);
                }, 500);
            }}
        >
            {menuContent}
        </Menu>
    )
}

export default Header;