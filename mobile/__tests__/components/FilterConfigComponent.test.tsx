/**
 * Tests for FilterConfigComponent (Legacy basic filters)
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { FilterConfigComponent } from '../../src/components/FilterConfigComponent';

// Mock expo-haptics
jest.mock('expo-haptics');

const defaultFilters = {
  followersMin: undefined,
  followersMax: undefined,
  engagementRate: undefined,
  hashtags: [],
  mentions: [],
  location: [],
  excludeUsers: [],
};

const mockOnChange = jest.fn();

describe('FilterConfigComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all filter sections', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Follower Count')).toBeTruthy();
      expect(screen.getByText('Engagement Rate')).toBeTruthy();
      expect(screen.getByText('Required Hashtags')).toBeTruthy();
      expect(screen.getByText('Required Mentions')).toBeTruthy();
      expect(screen.getByText('Location Filter')).toBeTruthy();
      expect(screen.getByText('Exclude Users')).toBeTruthy();
    });

    it('should render info card', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText(/All filters are optional/)).toBeTruthy();
    });

    it('should render min/max inputs for followers', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Minimum')).toBeTruthy();
      expect(screen.getByText('Maximum')).toBeTruthy();
      expect(screen.getByPlaceholderText('0')).toBeTruthy();
      expect(screen.getByPlaceholderText('Unlimited')).toBeTruthy();
    });
  });

  describe('Follower Count', () => {
    it('should update followersMin on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const minInput = screen.getByPlaceholderText('0');
      fireEvent.changeText(minInput, '1000');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ followersMin: 1000 })
      );
    });

    it('should update followersMax on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const maxInput = screen.getByPlaceholderText('Unlimited');
      fireEvent.changeText(maxInput, '100000');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ followersMax: 100000 })
      );
    });

    it('should handle invalid number input', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const minInput = screen.getByPlaceholderText('0');
      fireEvent.changeText(minInput, 'invalid');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ followersMin: undefined })
      );
    });

    it('should display existing values', () => {
      render(
        <FilterConfigComponent
          filters={{ ...defaultFilters, followersMin: 500, followersMax: 50000 }}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByDisplayValue('500')).toBeTruthy();
      expect(screen.getByDisplayValue('50000')).toBeTruthy();
    });
  });

  describe('Engagement Rate', () => {
    it('should update engagement rate on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const engagementInput = screen.getByPlaceholderText('Minimum % (e.g., 3.5)');
      fireEvent.changeText(engagementInput, '3.5');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ engagementRate: 3.5 })
      );
    });

    it('should display hint text', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Filter users with at least this engagement rate')).toBeTruthy();
    });
  });

  describe('Hashtags', () => {
    it('should update hashtags on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const hashtagsInput = screen.getByPlaceholderText('#giveaway #contest (one per line)');
      fireEvent.changeText(hashtagsInput, '#giveaway\n#contest');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ hashtags: ['#giveaway', '#contest'] })
      );
    });

    it('should filter empty lines', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const hashtagsInput = screen.getByPlaceholderText('#giveaway #contest (one per line)');
      fireEvent.changeText(hashtagsInput, '#giveaway\n\n#contest\n');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ hashtags: ['#giveaway', '#contest'] })
      );
    });

    it('should display existing hashtags', () => {
      render(
        <FilterConfigComponent
          filters={{ ...defaultFilters, hashtags: ['#giveaway', '#win'] }}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByDisplayValue('#giveaway\n#win')).toBeTruthy();
    });
  });

  describe('Mentions', () => {
    it('should update mentions on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const mentionsInput = screen.getByPlaceholderText('@yourpage @sponsor (one per line)');
      fireEvent.changeText(mentionsInput, '@page1\n@page2');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ mentions: ['@page1', '@page2'] })
      );
    });

    it('should display hint text', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Users must mention these accounts')).toBeTruthy();
    });
  });

  describe('Location', () => {
    it('should update location on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const locationInput = screen.getByPlaceholderText('United States, Canada, UK (one per line)');
      fireEvent.changeText(locationInput, 'France\nGermany');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ location: ['France', 'Germany'] })
      );
    });

    it('should display hint text', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Only include users from these locations')).toBeTruthy();
    });
  });

  describe('Exclude Users', () => {
    it('should update excluded users on change', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const excludeInput = screen.getByPlaceholderText('@user1 @user2 (one per line)');
      fireEvent.changeText(excludeInput, '@banned1\n@banned2');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ excludeUsers: ['@banned1', '@banned2'] })
      );
    });

    it('should display hint text', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      expect(screen.getByText('Exclude specific users from the draw')).toBeTruthy();
    });
  });

  describe('Platform Props', () => {
    it('should accept instagram platform', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      // Should render without error
      expect(screen.getByText('Follower Count')).toBeTruthy();
    });

    it('should accept tiktok platform', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="tiktok"
        />
      );
      
      expect(screen.getByText('Follower Count')).toBeTruthy();
    });

    it('should accept facebook platform', () => {
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="facebook"
        />
      );
      
      expect(screen.getByText('Follower Count')).toBeTruthy();
    });
  });

  describe('Haptic Feedback', () => {
    it('should trigger haptic feedback on change', () => {
      const Haptics = require('expo-haptics');
      
      render(
        <FilterConfigComponent
          filters={defaultFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const minInput = screen.getByPlaceholderText('0');
      fireEvent.changeText(minInput, '1000');
      
      expect(Haptics.impactAsync).toHaveBeenCalled();
    });
  });

  describe('Preserve Other Values', () => {
    it('should preserve other filter values when updating one', () => {
      const existingFilters = {
        ...defaultFilters,
        followersMin: 100,
        hashtags: ['#existing'],
      };
      
      render(
        <FilterConfigComponent
          filters={existingFilters}
          onChange={mockOnChange}
          platform="instagram"
        />
      );
      
      const maxInput = screen.getByPlaceholderText('Unlimited');
      fireEvent.changeText(maxInput, '5000');
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          followersMin: 100,
          followersMax: 5000,
          hashtags: ['#existing'],
        })
      );
    });
  });
});
