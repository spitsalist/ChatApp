import React, { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch('r2QSXCezv2O5ZGgjSOoXWiw2ErJXJ7hh');

function GifPicker({ onGifClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGifs = async (offset) => {
    if (searchTerm.trim()) {
      return await gf.search(searchTerm, { offset, limit: 10 });
    }
    return await gf.trending({ offset, limit: 10 });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search GIF"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid fetchGifs={fetchGifs} width={350} columns={3} onGifClick={onGifClick} />
    </div>
  );
}

export default GifPicker;