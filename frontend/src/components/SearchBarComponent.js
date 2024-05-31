import React from 'react';

export default function SearchBarComponent({ searchValue, setSearchValue, handleSubmit, showAddItemModal, showCartModal }) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form className="input-group my-3" onSubmit={handleSubmit}>
              <input 
                type="text"
                className="form-control border-radius-med" 
                placeholder="Type something" 
                value={searchValue} 
                onChange={(e) => setSearchValue(e.target.value)} 
              />
                {!showAddItemModal && !showCartModal ? <button className="btn btn-primary mx-1" type="submit">Search Item</button> : <></>}
            </form>
          </div>
        </div>
      </div>
    );
};