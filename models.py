from pydantic import BaseModel, HttpUrl, Field, validator
from typing import List, Optional
from decimal import Decimal




class LegalCompanyName(BaseModel):
    name: str 

class HeadquartersInfo(BaseModel):
    location: str


class YearIncorporated(BaseModel):
    year: str



class BusinessLine(BaseModel):
    line_name: str
    description: str
   

class CompanyBusinessLinesSchema(BaseModel):
    company_name: str = Field(..., example="Generic Company Inc.")
    # Explicit typing for lists of Pydantic models.
    primary_business_lines: List[BusinessLine]
    other_notable_business_lines: List[str]


class BriefSynopsis(BaseModel):
    synopsis: str
    

class BannerBrand(BaseModel):
    name: str
    description: str

class CompanyBannerBrands(BaseModel):
    company_name: str
    banner_brands: List[BannerBrand]

    class Config:
        extra = "ignore"


class DemographicCharacteristic(BaseModel):
    age: str 
    income: str
    education: str
    occupation: str


class PsychographicCharacteristic(BaseModel):
    lifestyle: str
    values: str
    interests: str


class BehavioralCharacteristic(BaseModel):
    usage_patterns: str
    brand_loyalty: str
    purchase_behavior: str


class StrategicImplication(BaseModel):
    product_development: str = Field(..., description="Insights for developing new products or services.")
    marketing_strategies: str = Field(..., description="How to tailor marketing to resonate with the target audience.")
    customer_engagement: str = Field(..., description="Strategies for building brand loyalty and strong customer relationships.")
    expansion_opportunities: str = Field(..., description="Potential growth areas based on the target market.")


class TargetMarketAnalysis(BaseModel):
    demographic_characteristics: DemographicCharacteristic
    psychographic_characteristics: PsychographicCharacteristic
    behavioral_characteristics: BehavioralCharacteristic
    strategic_implications: StrategicImplication



class CompanyRevenueData(BaseModel):
    revenue: str 
    extra_information: Optional[str] = None
    rev_2022: Optional[str] = None
    rev_2023: Optional[str] = None


class FinancialPerformance(BaseModel):
    description: str
    key_highlights: List[str] 
    summary: str
    link: List[HttpUrl]

class MarketCapitalization(BaseModel):
    description: str



class Shareholder(BaseModel):
    shareholder: str
    ownership_percentage: Optional[float] = None  # Set default to None

    # Custom validator to handle the percentage string
    @validator('ownership_percentage', pre=True)
    def convert_percentage_string(cls, value):
        if isinstance(value, str) and value.endswith('%'):
            # Remove the percentage symbol and convert to float
            try:
                return float(value.rstrip('%'))
            except ValueError:
                # Handle the case where conversion to float is not possible
                raise ValueError(f"Cannot convert ownership percentage to float: {value}")
        # If the value is not a string with a %, it's already None or a float
        return value

class CompanyOwnership(BaseModel):
    ownership_structure: str
    major_shareholders: List[Shareholder]
    summary: str

    class Config:
        extra = "ignore"

class FoundingStory(BaseModel):
    description: str

class KeyPointsOfDifference(BaseModel):
    description: str
    points_of_difference: List[str]

    
class CompanyStrategy(BaseModel):
    initiatives: List[str]
    

class RiskReport(BaseModel):
    title: str
    risks: List[str]
    hyperlinks: List[HttpUrl]

    class Config:
        extra = "ignore"


class MainCompetitors(BaseModel):
    competitors: List[str]    



class SWOTCategory(BaseModel):
    description: str
    link: HttpUrl

class SWOTAnalysis(BaseModel):
    Strengths: SWOTCategory
    Weaknesses: SWOTCategory
    Opportunities: SWOTCategory
    Threats: SWOTCategory

class SWOTOutput(BaseModel):
    SWOT_Analysis: SWOTAnalysis



class DesignImages(BaseModel):
    images: List[HttpUrl]


class DesignAgency(BaseModel):
    agency: str
    description: str
    website: HttpUrl



class NewsItem(BaseModel):
    description: str
    url: HttpUrl

class CompanyNews(BaseModel):
    news_items: List[NewsItem]
    

class MovesItem(BaseModel):
    description: str
    url: HttpUrl

class ExecutiveMoves(BaseModel):
    moves_items: List[MovesItem]


