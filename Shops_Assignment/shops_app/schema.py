
import graphene
from graphene import relay, ObjectType
from graphene.types import datetime
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from django.db.models import fields
from shops_app.models import User, Category, Product

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id","username", "email")

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        

class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        filter_fields = {
        'title': ['exact', 'icontains', 'istartswith'],
        'description': ['exact', 'icontains', 'istartswith'],
        'category__name': ['exact'],
        'created_at' : ['exact'],
        'price' :  ['lt', 'gt']
        }
        interfaces = (relay.Node, )

class ProductType(DjangoObjectType):
    class Meta:
        model = Product


class CategoryInput(graphene.InputObjectType):
    name = graphene.String()

class UserInput(graphene.InputObjectType):
    email = graphene.String()
    username = graphene.String()


class ProductInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()
    price = graphene.Float()
    quantity = graphene.Int()
    category = graphene.Field(CategoryInput)
    owner = graphene.Field(UserInput)
    createdAt = graphene.DateTime()

class createProduct(graphene.Mutation):
    product = graphene.Field(ProductType)

    class Input:
        title = graphene.String()
        description = graphene.String()
        price = graphene.Float()
        quantity = graphene.Int()
        category_id = graphene.ID()
        owner_id = graphene.ID()

    @staticmethod
    def mutate(root, info, **input):
        category_instance = Category.objects.get(id=input.get('category_id'))
        owner_instance = User.objects.get(id=input.get('owner_id'))
        product_instance = Product(
            title = input.get("title"),
            description = input.get("description"),
            price = input.get("price"),
            quantity = input.get("quantity"),
            category = category_instance,
            owner = owner_instance
        )
        product_instance.save()
        return createProduct(product=product_instance)

class createCategory(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    category = graphene.Field(CategoryType)

    def mutate(self, info, name):
        category = Category(name=name)
        category.save()
        return createCategory(category=category)
        
class MyMutations(ObjectType):
    create_product = createProduct.Field()
    create_category = createCategory.Field()
    # create_user = createUser.Field()

# class Query(graphene.ObjectType):
#     all_products = graphene.List(ProductType)
#     all_categories = graphene.List(CategoryType)

#     def resolve_all_products(self, info):
#         return Product.objects.all()

#     def resolve_all_categories(self, info):
#         return Category.objects.all()

class Query(graphene.ObjectType):
    product = relay.Node.Field(ProductNode)
    all_products = DjangoFilterConnectionField(ProductNode)
    # all_products = graphene.List(ProductType)
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, category_id=graphene.Int())

    # def resolve_all_products(self, info):
    #     return Product.objects.all()

    def resolve_all_categories(self, info):
        return Category.objects.all()

    def resolve_category(self, info, category_id):
        return Category.objects.get(id = category_id)


schema = graphene.Schema(query=Query, mutation=MyMutations)
