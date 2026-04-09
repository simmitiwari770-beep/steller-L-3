import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../../src/components/Navbar';

describe('Navbar Component', () => {
  it('renders logo and connect button when disconnected', () => {
    render(<Navbar isConnected={false} />);
    expect(screen.getByText(/Stellar/i)).toBeDefined();
    expect(screen.getByText(/Connect Wallet/i)).toBeDefined();
  });

  it('renders wallet address when connected', () => {
    const address = 'GABCDEF123456789';
    render(<Navbar isConnected={true} address={address} />);
    // Sliced: GABCDE...6789
    expect(screen.getByText(/GABCDE/i)).toBeDefined();
    expect(screen.getByText(/6789/i)).toBeDefined();
  });
});
